package com.english.speaking.chat.service;

import com.english.speaking.chat.dto.MessageResponse;
import com.english.speaking.chat.model.Message;
import com.english.speaking.chat.repository.MessageRepository;
import com.english.speaking.friend.repository.FriendshipRepository;
import com.english.speaking.ws.router.MessageRouter;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

@Service
public class ChatService {

	private final MessageRepository messages;
	private final FriendshipRepository friendships;
	private final MessageRouter router;
	private final ObjectMapper mapper;

	public ChatService(MessageRepository messages, FriendshipRepository friendships,
			MessageRouter router, ObjectMapper mapper) {
		this.messages = messages;
		this.friendships = friendships;
		this.router = router;
		this.mapper = mapper;
	}

	@Transactional
	public void send(Long senderId, Long recipientId, String body) {
		if (body == null || body.isBlank() || !friendships.areFriends(senderId, recipientId)) {
			return;
		}
		Message m = new Message();
		m.setSenderId(senderId);
		m.setRecipientId(recipientId);
		m.setBody(body.strip());
		m.setCreatedAt(OffsetDateTime.now());
		Message saved = messages.save(m);
		push(recipientId, saved);
		push(senderId, saved);
	}

	@Transactional
	public List<MessageResponse> history(Long userId, Long friendId) {
		if (!friendships.areFriends(userId, friendId)) {
			return List.of();
		}
		// Opening the conversation marks the friend's messages to me as read.
		messages.markConversationRead(userId, friendId, OffsetDateTime.now());
		return messages.findConversation(userId, friendId).stream()
				.map(MessageResponse::from)
				.toList();
	}

	private void push(Long to, Message m) {
		var envelope = Map.of(
				"type", "chat.receive",
				"to", String.valueOf(to),
				"payload", Map.of(
						"id", m.getId(),
						"senderId", m.getSenderId(),
						"recipientId", m.getRecipientId(),
						"body", m.getBody(),
						"createdAt", m.getCreatedAt().toString()));
		router.publish(mapper.writeValueAsString(envelope));
	}
}
