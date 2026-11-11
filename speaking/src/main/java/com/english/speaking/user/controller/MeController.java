package com.english.speaking.user.controller;

import com.english.speaking.user.dto.OnboardingRequest;
import com.english.speaking.user.dto.UpdateProfileRequest;
import com.english.speaking.user.dto.UserResponse;
import com.english.speaking.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

	@PatchMapping("/me")
	public ResponseEntity<UserResponse> updateProfile(
			@AuthenticationPrincipal Long userId,
			@Valid @RequestBody UpdateProfileRequest request) {
		return userService.updateProfile(userId, request)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/me/onboarding")
	public ResponseEntity<UserResponse> onboard(
			@AuthenticationPrincipal Long userId,
			@Valid @RequestBody OnboardingRequest request) {
		return userService.completeOnboarding(userId, request)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
