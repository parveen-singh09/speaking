package com.english.speaking.auth.service;

import com.english.speaking.auth.dto.GoogleUser;
import com.english.speaking.auth.dto.TokenResponse;
import com.english.speaking.auth.exception.InvalidTokenException;
import com.english.speaking.user.model.User;
import com.english.speaking.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

	private final GoogleOAuthClient google;
	private final UserRepository users;
	private final JwtService jwt;

	public AuthService(GoogleOAuthClient google, UserRepository users, JwtService jwt) {
		this.google = google;
		this.users = users;
		this.jwt = jwt;
	}

	@Transactional
	public TokenResponse loginWithGoogle(String code) {
		GoogleUser g = google.exchangeCode(code);
		User user = users.findByGoogleSub(g.sub()).orElseGet(User::new);
		user.setGoogleSub(g.sub());
		user.setEmail(g.email());
		if (user.getName() == null) {
			user.setName(g.name());
		}
		if (user.getAvatarUrl() == null) {
			user.setAvatarUrl(g.picture());
		}
		User saved = users.save(user);
		return issueFor(saved.getId());
	}

	public TokenResponse refresh(String refreshToken) {
		if (!jwt.isRefresh(refreshToken)) {
			throw new InvalidTokenException(new IllegalArgumentException("Not a valid refresh token"));
		}
		return issueFor(jwt.parseUserId(refreshToken));
	}

	private TokenResponse issueFor(Long userId) {
		return new TokenResponse(jwt.issueAccess(userId), jwt.issueRefresh(userId));
	}
}
