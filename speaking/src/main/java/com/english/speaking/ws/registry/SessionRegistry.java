package com.english.speaking.ws.registry;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class SessionRegistry {

	private final ConcurrentHashMap<Long, WebSocketSession> byUser = new ConcurrentHashMap<>();

	public void add(Long userId, WebSocketSession session) {
		byUser.put(userId, session);
	}

	public void remove(Long userId) {
		byUser.remove(userId);
	}

	public Optional<WebSocketSession> get(Long userId) {
		return Optional.ofNullable(byUser.get(userId));
	}
}
