package com.english.speaking.chat.controller;

import com.english.speaking.chat.dto.MessageResponse;
import com.english.speaking.chat.service.ChatService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/messages")
public class ChatController {

	private final ChatService chat;

	public ChatController(ChatService chat) {
		this.chat = chat;
	}

	@GetMapping("/{friendId}")
	public List<MessageResponse> history(
			@AuthenticationPrincipal Long userId,
			@PathVariable Long friendId) {
		return chat.history(userId, friendId);
	}
}
