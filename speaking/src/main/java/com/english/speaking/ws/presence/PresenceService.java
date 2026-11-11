package com.english.speaking.ws.presence;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class PresenceService {

	private static final String ONLINE = "presence:online";

	private final StringRedisTemplate redis;

	public PresenceService(StringRedisTemplate redis) {
		this.redis = redis;
	}

	public void online(Long userId) {
		redis.opsForSet().add(ONLINE, String.valueOf(userId));
	}

	public void offline(Long userId) {
		redis.opsForSet().remove(ONLINE, String.valueOf(userId));
	}

	public boolean isOnline(Long userId) {
		return Boolean.TRUE.equals(redis.opsForSet().isMember(ONLINE, String.valueOf(userId)));
	}

	public long onlineCount() {
		Long size = redis.opsForSet().size(ONLINE);
		return size != null ? size : 0L;
	}
}
