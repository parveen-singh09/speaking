package com.english.speaking.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OnboardingRequest(
		@NotBlank @Pattern(regexp = "beginner|intermediate|advanced|fluent") String englishLevel,
		@NotBlank String avatarUrl,
		@NotBlank @Pattern(regexp = "male|female") String gender,
		@NotBlank String occupation,
		@NotBlank String location) {}
