package com.english.speaking.friend.controller;

import com.english.speaking.friend.dto.FriendResponse;
import com.english.speaking.friend.dto.SendRequest;
import com.english.speaking.friend.service.FriendService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/friends")
public class FriendController {

	private final FriendService friends;

	public FriendController(FriendService friends) {
		this.friends = friends;
	}

	@GetMapping
	public List<FriendResponse> list(@AuthenticationPrincipal Long userId) {
		return friends.listFriends(userId);
	}

	@GetMapping("/pending")
	public List<FriendResponse> pending(@AuthenticationPrincipal Long userId) {
		return friends.listPending(userId);
	}

	@PostMapping("/requests")
	public ResponseEntity<Void> send(
			@AuthenticationPrincipal Long userId,
			@Valid @RequestBody SendRequest request) {
		friends.sendRequest(userId, request.addresseeId());
		return ResponseEntity.accepted().build();
	}

	@PostMapping("/{friendshipId}/accept")
	public ResponseEntity<Void> accept(
			@AuthenticationPrincipal Long userId,
			@PathVariable Long friendshipId) {
		friends.accept(userId, friendshipId);
		return ResponseEntity.ok().build();
	}
}
