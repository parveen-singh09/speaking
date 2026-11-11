package com.english.speaking.user.dto;

import com.english.speaking.user.model.User;

public record UserResponse(
		Long id,
		String email,
		String name,
		String avatarUrl,
		String bio,
		String englishLevel,
		String gender,
		String occupation,
		String location,
		boolean onboarded) {

	public static UserResponse from(User u) {
		return new UserResponse(u.getId(), u.getEmail(), u.getName(),
				u.getAvatarUrl(), u.getBio(), u.getEnglishLevel(),
				u.getGender(), u.getOccupation(), u.getLocation(), u.isOnboarded());
	}
}
