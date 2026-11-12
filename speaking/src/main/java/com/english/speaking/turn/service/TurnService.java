package com.english.speaking.turn.service;

import com.english.speaking.turn.dto.IceServer;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class TurnService {

	private static final Logger log = LoggerFactory.getLogger(TurnService.class);

	private final String stunUrl;
	private final String turnUrl;
	private final String turnSecret;
	private final String turnUsername;
	private final String turnCredential;
	private final long ttlSeconds;
	private final String meteredDomain;
	private final String meteredSecret;
	private final RestClient http = RestClient.create();

	public TurnService(
			@Value("${app.turn.stun-url}") String stunUrl,
			@Value("${app.turn.url}") String turnUrl,
			@Value("${app.turn.secret}") String turnSecret,
			@Value("${app.turn.username}") String turnUsername,
			@Value("${app.turn.credential}") String turnCredential,
			@Value("${app.turn.ttl-seconds}") long ttlSeconds,
			@Value("${app.metered.domain}") String meteredDomain,
			@Value("${app.metered.secret}") String meteredSecret) {
		this.stunUrl = stunUrl;
		this.turnUrl = turnUrl;
		this.turnSecret = turnSecret;
		this.turnUsername = turnUsername;
		this.turnCredential = turnCredential;
		this.ttlSeconds = ttlSeconds;
		this.meteredDomain = meteredDomain;
		this.meteredSecret = meteredSecret;
	}

	public List<IceServer> iceServers(Long userId) {
		if (meteredSecret != null && !meteredSecret.isBlank()) {
			List<IceServer> fromMetered = fetchFromMetered();
			if (fromMetered != null && !fromMetered.isEmpty()) {
				return fromMetered;
			}
		}
		return staticOrSigned(userId);
	}

	private List<IceServer> fetchFromMetered() {
		try {
			String uri = "https://" + meteredDomain + "/api/v1/turn/credentials?apiKey=" + meteredSecret;
			IceServer[] servers = http.get().uri(uri).retrieve().body(IceServer[].class);
			return servers != null ? List.of(servers) : null;
		} catch (Exception e) {
			log.error("Metered TURN credential fetch failed", e);
			return null;
		}
	}

	private List<IceServer> staticOrSigned(Long userId) {
		List<IceServer> servers = new ArrayList<>();
		if (stunUrl != null && !stunUrl.isBlank()) {
			servers.add(IceServer.stun(stunUrl));
		}
		if (!turnUrl.isBlank() && !turnUsername.isBlank() && !turnCredential.isBlank()) {
			servers.add(new IceServer(turnUrl, turnUsername, turnCredential));
		} else if (!turnUrl.isBlank() && !turnSecret.isBlank()) {
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
