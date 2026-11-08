package com.english.speaking.ws.router;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessageRouter {

	public static final String CHANNEL = "signaling";

	private final StringRedisTemplate redis;

	public MessageRouter(StringRedisTemplate redis) {
		this.redis = redis;
	}

	public void publish(String envelopeJson) {
		redis.convertAndSend(CHANNEL, envelopeJson);
	}
}
