package com.english.speaking.chat.dto;

import com.english.speaking.chat.model.Message;
import java.time.OffsetDateTime;

public record MessageResponse(
		Long id,
		Long senderId,
		Long recipientId,
		String body,
		OffsetDateTime createdAt) {

	public static MessageResponse from(Message m) {
		return new MessageResponse(m.getId(), m.getSenderId(), m.getRecipientId(),
				m.getBody(), m.getCreatedAt());
	}
}
