package com.english.speaking.user.controller;

import com.english.speaking.user.dto.UserResponse;
import com.english.speaking.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MeController {

	private final UserRepository users;

	public MeController(UserRepository users) {
		this.users = users;
	}

	@GetMapping("/me")
	public ResponseEntity<UserResponse> me() {
		return users.findAll().stream().findFirst()
				.map(UserResponse::from)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.noContent().build());
	}
}
