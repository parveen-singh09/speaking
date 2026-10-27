package com.english.speaking.user.model;

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
@Table(name = "users")
@Getter
@Setter
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "google_sub", nullable = false, unique = true)
	private String googleSub;

	@Column(nullable = false)
	private String email;

	private String name;

	@Column(name = "avatar_url")
	private String avatarUrl;

	private String bio;

	@Column(name = "english_level")
	private String englishLevel;

	@Column(name = "created_at", insertable = false, updatable = false)
	private OffsetDateTime createdAt;
}
