package com.english.speaking.turn.service;

import com.english.speaking.turn.dto.IceServer;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TurnService {

	private final String stunUrl;
	private final String turnUrl;
	private final String turnSecret;
	private final long ttlSeconds;

	public TurnService(
			@Value("${app.turn.stun-url}") String stunUrl,
			@Value("${app.turn.url}") String turnUrl,
			@Value("${app.turn.secret}") String turnSecret,
			@Value("${app.turn.ttl-seconds}") long ttlSeconds) {
		this.stunUrl = stunUrl;
		this.turnUrl = turnUrl;
		this.turnSecret = turnSecret;
		this.ttlSeconds = ttlSeconds;
	}

	public List<IceServer> iceServers(Long userId) {
		List<IceServer> servers = new ArrayList<>();
		if (stunUrl != null && !stunUrl.isBlank()) {
			servers.add(IceServer.stun(stunUrl));
		}
		if (!turnUrl.isBlank() && !turnSecret.isBlank()) {
			long expiry = Instant.now().getEpochSecond() + ttlSeconds;
			String username = expiry + ":" + userId;
			servers.add(new IceServer(turnUrl, username, sign(username)));
		}
		return servers;
	}

	private String sign(String username) {
		try {
			Mac mac = Mac.getInstance("HmacSHA1");
			mac.init(new SecretKeySpec(turnSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA1"));
			return Base64.getEncoder()
					.encodeToString(mac.doFinal(username.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception e) {
			throw new IllegalStateException("Failed to sign TURN credential", e);
		}
	}
}
