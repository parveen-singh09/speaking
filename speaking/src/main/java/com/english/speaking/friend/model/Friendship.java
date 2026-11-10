package com.english.speaking.friend.model;

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
@Table(name = "friendships")
@Getter
@Setter
public class Friendship {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "requester_id", nullable = false)
	private Long requesterId;

	@Column(name = "addressee_id", nullable = false)
	private Long addresseeId;

	private String status;

	@Column(name = "created_at", insertable = false, updatable = false)
	private OffsetDateTime createdAt;
}
