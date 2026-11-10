package com.english.speaking.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
		@Size(max = 500) String bio,
		@Pattern(regexp = "beginner|intermediate|advanced", message = "must be beginner, intermediate, or advanced")
		String englishLevel) {}
