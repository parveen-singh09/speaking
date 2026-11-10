package com.english.speaking.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
		@NotBlank(message = "Email is required")
		@Email(message = "Enter a valid email address")
		String email,

		@NotBlank(message = "Password is required")
		@Size(min = 8, max = 100, message = "Password must be at least 8 characters")
		@Pattern(regexp = ".*[0-9].*", message = "Password must contain at least one number")
		String password,

		@NotBlank(message = "Name is required")
		@Size(min = 2, max = 100, message = "Name must be at least 2 characters")
		String name) {}
