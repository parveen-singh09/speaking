package com.english.speaking.friend.dto;

import com.english.speaking.user.model.User;

public record UserSearchResult(
		Long userId,
		String name,
		String avatarUrl,
		String englishLevel,
		String location) {

	public static UserSearchResult from(User u) {
		return new UserSearchResult(u.getId(), u.getName(), u.getAvatarUrl(),
				u.getEnglishLevel(), u.getLocation());
	}
}
