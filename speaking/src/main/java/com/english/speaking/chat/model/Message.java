package com.english.speaking.chat.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "messages")
@Getter
@Setter
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "sender_id", nullable = false)
	private Long senderId;

	@Column(name = "recipient_id", nullable = false)
	private Long recipientId;

	@Column(nullable = false)
	private String body;

	@Column(name = "created_at", nullable = false)
	private OffsetDateTime createdAt;

	@Column(name = "read_at")
	private OffsetDateTime readAt;
}
