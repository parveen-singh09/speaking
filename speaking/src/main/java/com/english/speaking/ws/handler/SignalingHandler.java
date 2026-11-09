package com.english.speaking.ws.handler;

import com.english.speaking.ws.interceptor.JwtHandshakeInterceptor;
import com.english.speaking.ws.match.MatchService;
import com.english.speaking.ws.presence.PresenceService;
import com.english.speaking.ws.registry.SessionRegistry;
import com.english.speaking.ws.router.MessageRouter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;

@Component
public class SignalingHandler extends TextWebSocketHandler {

	private static final Logger log = LoggerFactory.getLogger(SignalingHandler.class);

	private final SessionRegistry sessions;
	private final PresenceService presence;
	private final MessageRouter router;
	private final MatchService match;
	private final ObjectMapper mapper;

	public SignalingHandler(SessionRegistry sessions, PresenceService presence,
			MessageRouter router, MatchService match, ObjectMapper mapper) {
		this.sessions = sessions;
		this.presence = presence;
		this.router = router;
		this.match = match;
		this.mapper = mapper;
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) {
		Long userId = userId(session);
		sessions.add(userId, session);
		presence.online(userId);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
		Long userId = userId(session);
		sessions.remove(userId);
		presence.offline(userId);
		match.cancel(userId);
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) {
		log.error("[ws] transport error userId={}", userId(session), exception);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) {
		Long userId = userId(session);
		String type = readType(message.getPayload());
		if ("match.find".equals(type)) {
			match.find(userId);
		} else if ("match.cancel".equals(type)) {
			match.cancel(userId);
		} else {
			router.publish(message.getPayload());
		}
	}

	private String readType(String payload) {
		try {
			return mapper.readTree(payload).path("type").asText(null);
		} catch (Exception e) {
			return null;
		}
	}

	private Long userId(WebSocketSession session) {
		return (Long) session.getAttributes().get(JwtHandshakeInterceptor.USER_ID);
	}
}
