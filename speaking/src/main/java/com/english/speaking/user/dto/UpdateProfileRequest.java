package com.english.speaking.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
		@Size(max = 500) String bio,
		@Pattern(regexp = "beginner|intermediate|advanced|fluent", message = "must be beginner, intermediate, advanced, or fluent")
		String englishLevel,
		@Size(max = 60) String occupation,
		@Size(max = 100) String location,
		@Size(max = 512) String avatarUrl) {}
