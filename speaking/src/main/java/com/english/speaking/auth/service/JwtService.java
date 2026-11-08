package com.english.speaking.auth.service;

import com.english.speaking.auth.exception.InvalidTokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

	private static final String CLAIM_TYPE = "typ";
	private static final String TYPE_ACCESS = "access";
	private static final String TYPE_REFRESH = "refresh";

	private final SecretKey key;
	private final Duration accessTtl;
	private final Duration refreshTtl;

	public JwtService(
			@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.access-ttl}") Duration accessTtl,
			@Value("${app.jwt.refresh-ttl}") Duration refreshTtl) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes());
		this.accessTtl = accessTtl;
		this.refreshTtl = refreshTtl;
	}

	public String issueAccess(Long userId) {
		return issue(userId, TYPE_ACCESS, accessTtl);
	}

	public String issueRefresh(Long userId) {
		return issue(userId, TYPE_REFRESH, refreshTtl);
	}

	public Long parseUserId(String token) {
		var subject = parse(token).getSubject();
		try {
			return Long.valueOf(subject);
		} catch (NumberFormatException e) {
			throw new InvalidTokenException(e);
		}
	}

	public boolean isRefresh(String token) {
		try {
			return TYPE_REFRESH.equals(parse(token).get(CLAIM_TYPE, String.class));
		} catch (InvalidTokenException e) {
			return false;
		}
	}

	private Claims parse(String token) {
		try {
			return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
		} catch (JwtException | IllegalArgumentException e) {
			throw new InvalidTokenException(e);
		}
	}

	private String issue(Long userId, String type, Duration ttl) {
		var now = Instant.now();
		return Jwts.builder()
				.subject(String.valueOf(userId))
				.claim(CLAIM_TYPE, type)
				.issuedAt(Date.from(now))
				.expiration(Date.from(now.plus(ttl)))
				.signWith(key)
				.compact();
	}
}
