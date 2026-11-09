package com.english.speaking.ws.match;

import com.english.speaking.ws.presence.PresenceService;
import com.english.speaking.ws.router.MessageRouter;
import java.util.Map;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class MatchService {

	private static final String QUEUE = "match:queue";

	private final StringRedisTemplate redis;
	private final PresenceService presence;
	private final MessageRouter router;
	private final ObjectMapper mapper;

	public MatchService(StringRedisTemplate redis, PresenceService presence,
			MessageRouter router, ObjectMapper mapper) {
		this.redis = redis;
		this.presence = presence;
		this.router = router;
		this.mapper = mapper;
	}

	public synchronized void find(Long userId) {
		String me = String.valueOf(userId);
		redis.opsForList().remove(QUEUE, 0, me);

		String partner = nextOnlinePartner(me);
		if (partner == null) {
			redis.opsForList().rightPush(QUEUE, me);
			return;
		}
		notifyMatch(me, partner, true);
		notifyMatch(partner, me, false);
	}

	public void cancel(Long userId) {
		redis.opsForList().remove(QUEUE, 0, String.valueOf(userId));
	}

	private String nextOnlinePartner(String me) {
		String candidate;
		while ((candidate = redis.opsForList().leftPop(QUEUE)) != null) {
			if (!candidate.equals(me) && presence.isOnline(Long.valueOf(candidate))) {
				return candidate;
			}
		}
		return null;
	}

	private void notifyMatch(String to, String peerId, boolean initiator) {
		var envelope = Map.of(
				"type", "match.found",
				"to", to,
				"payload", Map.of("peerId", peerId, "initiator", initiator));
		router.publish(mapper.writeValueAsString(envelope));
	}
}
