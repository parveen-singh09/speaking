package com.english.speaking.user.controller;

import com.english.speaking.user.dto.UserResponse;
import com.english.speaking.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {

	private final UserService userService;

	public MeController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<UserResponse> me(@AuthenticationPrincipal Long userId) {
		return userService.getById(userId)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
