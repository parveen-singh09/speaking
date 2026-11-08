package com.english.speaking.ws.handler;

import com.english.speaking.ws.dto.Envelope;
import com.english.speaking.ws.registry.SessionRegistry;
import java.nio.charset.StandardCharsets;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import tools.jackson.databind.ObjectMapper;

@Component
public class SignalingSubscriber implements MessageListener {

	private final SessionRegistry sessions;
	private final ObjectMapper mapper;

	public SignalingSubscriber(SessionRegistry sessions, ObjectMapper mapper) {
		this.sessions = sessions;
		this.mapper = mapper;
	}

	@Override
	public void onMessage(Message message, byte[] pattern) {
		String json = new String(message.getBody(), StandardCharsets.UTF_8);
		Envelope envelope = mapper.readValue(json, Envelope.class);
		if (envelope.to() == null) {
			return;
		}
		Long target = Long.valueOf(envelope.to());
		sessions.get(target).ifPresent(session -> {
			try {
				session.sendMessage(new TextMessage(json));
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		});
	}
}
