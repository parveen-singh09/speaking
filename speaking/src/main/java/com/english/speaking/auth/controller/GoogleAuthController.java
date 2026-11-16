package com.english.speaking.auth.controller;

import com.english.speaking.auth.dto.TokenResponse;
import com.english.speaking.auth.service.AuthService;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/auth/google")
public class GoogleAuthController {

	private static final Duration STATE_TTL = Duration.ofMinutes(10);
	private static final Duration CODE_TTL = Duration.ofMinutes(1);
	private static final String STATE_PREFIX = "oauth:state:";
	private static final String CODE_PREFIX = "oauth:code:";

	private final AuthService auth;
	private final StringRedisTemplate redis;
	private final ObjectMapper mapper;
	private final String clientId;
	private final String redirectUri;
	private final String frontendUrl;

	public GoogleAuthController(AuthService auth, StringRedisTemplate redis, ObjectMapper mapper,
			@Value("${app.google.client-id}") String clientId,
			@Value("${app.google.redirect-uri}") String redirectUri,
			@Value("${app.frontend-url}") String frontendUrl) {
		this.auth = auth;
		this.redis = redis;
		this.mapper = mapper;
		this.clientId = clientId;
		this.redirectUri = redirectUri;
		this.frontendUrl = frontendUrl;
	}

	@GetMapping("/start")
	public ResponseEntity<Void> start() {
		String state = UUID.randomUUID().toString();
		redis.opsForValue().set(STATE_PREFIX + state, "1", STATE_TTL);
		String url = "https://accounts.google.com/o/oauth2/v2/auth"
				+ "?client_id=" + enc(clientId)
				+ "&redirect_uri=" + enc(redirectUri)
				+ "&response_type=code"
				+ "&scope=" + enc("openid email profile")
				+ "&state=" + enc(state);
		return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
	}

	@GetMapping("/callback")
	public ResponseEntity<Void> callback(@RequestParam String code, @RequestParam String state) {
		Boolean validState = redis.delete(STATE_PREFIX + state);
		if (!Boolean.TRUE.equals(validState)) {
			return redirectToFrontend("error=state");
		}
		try {
			TokenResponse tokens = auth.loginWithGoogle(code);
			String oneTime = UUID.randomUUID().toString();
			redis.opsForValue().set(CODE_PREFIX + oneTime,
					mapper.writeValueAsString(tokens), CODE_TTL);
			return redirectToFrontend("code=" + enc(oneTime));
		} catch (Exception e) {
			return redirectToFrontend("error=auth");
		}
	}

	@PostMapping("/exchange")
	public ResponseEntity<TokenResponse> exchange(@RequestBody ExchangeRequest request) {
		String json = redis.opsForValue().getAndDelete(CODE_PREFIX + request.code());
		if (json == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok(mapper.readValue(json, TokenResponse.class));
	}

	private ResponseEntity<Void> redirectToFrontend(String query) {
		return ResponseEntity.status(HttpStatus.FOUND)
				.location(URI.create(frontendUrl + "/auth/callback?" + query)).build();
	}

	private static String enc(String value) {
		return URLEncoder.encode(value, StandardCharsets.UTF_8);
	}

	public record ExchangeRequest(String code) {}
}
