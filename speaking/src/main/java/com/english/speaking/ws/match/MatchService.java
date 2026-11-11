package com.english.speaking.ws.match;

import com.english.speaking.user.repository.UserRepository;
import com.english.speaking.ws.presence.PresenceService;
import com.english.speaking.ws.router.MessageRouter;
import java.util.List;
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
	private final UserRepository users;
	private final ObjectMapper mapper;

	public MatchService(StringRedisTemplate redis, PresenceService presence,
			MessageRouter router, UserRepository users, ObjectMapper mapper) {
		this.redis = redis;
		this.presence = presence;
		this.router = router;
		this.users = users;
		this.mapper = mapper;
	}

	public synchronized void find(Long userId) {
		String me = String.valueOf(userId);
		redis.opsForList().remove(QUEUE, 0, me);

		String partner = bestPartner(me, levelOf(me));
		if (partner == null) {
			redis.opsForList().rightPush(QUEUE, me);
			return;
		}
		redis.opsForList().remove(QUEUE, 0, partner);
		notifyMatch(me, partner, true);
		notifyMatch(partner, me, false);
	}

	public void cancel(Long userId) {
		redis.opsForList().remove(QUEUE, 0, String.valueOf(userId));
	}

	private String bestPartner(String me, String myLevel) {
		List<String> queued = redis.opsForList().range(QUEUE, 0, -1);
		if (queued == null) {
			return null;
		}
		String fallback = null;
		for (String candidate : queued) {
			if (candidate.equals(me)) {
				continue;
			}
			if (!presence.isOnline(Long.valueOf(candidate))) {
				redis.opsForList().remove(QUEUE, 0, candidate);
				continue;
			}
			if (myLevel != null && myLevel.equals(levelOf(candidate))) {
				return candidate;
			}
			if (fallback == null) {
				fallback = candidate;
			}
		}
		return fallback;
	}

	private String levelOf(String userId) {
		return users.findById(Long.valueOf(userId))
				.map(u -> u.getEnglishLevel())
				.orElse(null);
	}

	private void notifyMatch(String to, String peerId, boolean initiator) {
		var partner = new java.util.HashMap<String, Object>();
		partner.put("peerId", peerId);
		partner.put("initiator", initiator);
		users.findById(Long.valueOf(peerId)).ifPresent(u -> {
			partner.put("name", u.getName());
			partner.put("avatarUrl", u.getAvatarUrl());
			partner.put("bio", u.getBio());
			partner.put("englishLevel", u.getEnglishLevel());
			partner.put("location", u.getLocation());
		});
		var envelope = Map.of(
				"type", "match.found",
				"to", to,
				"payload", partner);
		router.publish(mapper.writeValueAsString(envelope));
	}
}
