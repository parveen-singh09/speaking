package com.english.speaking.ws.handler;

import com.english.speaking.ws.interceptor.JwtHandshakeInterceptor;
import com.english.speaking.ws.presence.PresenceService;
import com.english.speaking.ws.registry.SessionRegistry;
import com.english.speaking.ws.router.MessageRouter;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class SignalingHandler extends TextWebSocketHandler {

	private final SessionRegistry sessions;
	private final PresenceService presence;
	private final MessageRouter router;

	public SignalingHandler(SessionRegistry sessions, PresenceService presence, MessageRouter router) {
		this.sessions = sessions;
		this.presence = presence;
		this.router = router;
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
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) {
		router.publish(message.getPayload());
	}

	private Long userId(WebSocketSession session) {
		return (Long) session.getAttributes().get(JwtHandshakeInterceptor.USER_ID);
	}
}
