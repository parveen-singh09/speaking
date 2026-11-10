package com.english.speaking.friend.dto;

import com.english.speaking.user.model.User;

public record FriendResponse(
		Long friendshipId,
		Long userId,
		String name,
		String avatarUrl,
		String englishLevel) {

	public static FriendResponse of(Long friendshipId, User u) {
		return new FriendResponse(friendshipId, u.getId(), u.getName(),
				u.getAvatarUrl(), u.getEnglishLevel());
	}
}
