package com.english.speaking.friend.dto;

import com.english.speaking.user.model.User;

public record FriendResponse(
		Long friendshipId,
		Long userId,
		String name,
		String avatarUrl,
		String englishLevel,
		String bio,
		String location,
		boolean online,
		String lastMessage,
		boolean lastMessageFromMe,
		long unread) {

	public static FriendResponse of(Long friendshipId, User u) {
		return new FriendResponse(friendshipId, u.getId(), u.getName(),
				u.getAvatarUrl(), u.getEnglishLevel(), u.getBio(), u.getLocation(),
				false, null, false, 0);
	}

	public static FriendResponse of(Long friendshipId, User u, boolean online,
			String lastMessage, boolean lastMessageFromMe, long unread) {
		return new FriendResponse(friendshipId, u.getId(), u.getName(),
				u.getAvatarUrl(), u.getEnglishLevel(), u.getBio(), u.getLocation(),
				online, lastMessage, lastMessageFromMe, unread);
	}
}
