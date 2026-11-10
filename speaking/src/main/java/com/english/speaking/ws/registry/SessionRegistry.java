package com.english.speaking.ws.registry;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

@Component
public class SessionRegistry {

	private static final int SEND_TIME_LIMIT_MS = 10_000;
	private static final int BUFFER_SIZE_LIMIT = 512 * 1024;

	private final ConcurrentHashMap<Long, WebSocketSession> byUser = new ConcurrentHashMap<>();

	public void add(Long userId, WebSocketSession session) {
		byUser.put(userId, new ConcurrentWebSocketSessionDecorator(
				session, SEND_TIME_LIMIT_MS, BUFFER_SIZE_LIMIT));
	}

	public void remove(Long userId) {
		byUser.remove(userId);
	}

	public Optional<WebSocketSession> get(Long userId) {
		return Optional.ofNullable(byUser.get(userId));
	}
}
