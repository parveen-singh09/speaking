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

	@Column(name = "google_avatar_url")
	private String googleAvatarUrl;

	private String bio;

	@Column(name = "english_level")
	private String englishLevel;

	private String gender;

	private String occupation;

	private String location;

	@Column(nullable = false)
	private boolean onboarded;

	@Column(name = "password_hash")
	private String passwordHash;

	@Column(name = "created_at", insertable = false, updatable = false)
	private OffsetDateTime createdAt;
}
