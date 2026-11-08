package com.english.speaking.auth.controller;

import com.english.speaking.auth.dto.LoginRequest;
import com.english.speaking.auth.dto.RefreshRequest;
import com.english.speaking.auth.dto.TokenResponse;
import com.english.speaking.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService auth;

	public AuthController(AuthService auth) {
		this.auth = auth;
	}

	@PostMapping("/google")
	public TokenResponse google(@Valid @RequestBody LoginRequest request) {
		return auth.loginWithGoogle(request.code());
	}

	@PostMapping("/refresh")
	public TokenResponse refresh(@Valid @RequestBody RefreshRequest request) {
		return auth.refresh(request.refreshToken());
	}
}
