package com.english.speaking.auth.service;

import com.english.speaking.auth.dto.GoogleUser;
import com.english.speaking.auth.dto.TokenResponse;
import com.english.speaking.auth.exception.InvalidTokenException;
import com.english.speaking.user.model.User;
import com.english.speaking.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

	private final GoogleOAuthClient google;
	private final UserRepository users;
	private final JwtService jwt;
	private final PasswordEncoder passwordEncoder;

	public AuthService(GoogleOAuthClient google, UserRepository users, JwtService jwt,
			PasswordEncoder passwordEncoder) {
		this.google = google;
		this.users = users;
		this.jwt = jwt;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public TokenResponse signup(String email, String password, String name) {
		if (users.findByEmail(email).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
		}
		User user = new User();
		user.setEmail(email);
		user.setName(name);
		user.setPasswordHash(passwordEncoder.encode(password));
		return issueFor(users.save(user).getId());
	}

	public TokenResponse login(String email, String password) {
		User user = users.findByEmail(email)
				.filter(u -> u.getPasswordHash() != null
						&& passwordEncoder.matches(password, u.getPasswordHash()))
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.UNAUTHORIZED, "Invalid email or password"));
		return issueFor(user.getId());
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
