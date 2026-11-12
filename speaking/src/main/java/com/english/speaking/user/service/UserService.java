package com.english.speaking.user.service;

import com.english.speaking.call.repository.UserStatsRepository;
import com.english.speaking.friend.repository.FriendshipRepository;
import com.english.speaking.user.dto.OnboardingRequest;
import com.english.speaking.user.dto.PublicProfileResponse;
import com.english.speaking.user.dto.UpdateProfileRequest;
import com.english.speaking.user.dto.UserResponse;
import com.english.speaking.user.repository.UserRepository;
import com.english.speaking.ws.presence.PresenceService;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

	private final UserRepository users;
	private final UserStatsRepository stats;
	private final FriendshipRepository friendships;
	private final PresenceService presence;

	public UserService(UserRepository users, UserStatsRepository stats,
			FriendshipRepository friendships, PresenceService presence) {
		this.users = users;
		this.stats = stats;
		this.friendships = friendships;
		this.presence = presence;
	}

	public Optional<UserResponse> getById(Long id) {
		return users.findById(id).map(UserResponse::from);
	}

	public Optional<PublicProfileResponse> publicProfile(Long viewerId, Long targetId) {
		if (!viewerId.equals(targetId) && !friendships.areFriends(viewerId, targetId)) {
			return Optional.empty();
		}
		return users.findById(targetId).map(u -> {
			var s = stats.findById(targetId).orElse(null);
			long totalCalls = s != null ? s.getTotalCalls() : 0;
			long totalSec = s != null ? s.getTotalCallSec() : 0;
			long friendCount = friendships.countAcceptedForUser(targetId);
			return new PublicProfileResponse(u.getId(), u.getName(), u.getAvatarUrl(),
					u.getBio(), u.getEnglishLevel(), u.getOccupation(), u.getLocation(),
					presence.isOnline(targetId), totalCalls, totalSec, friendCount);
		});
	}

	@Transactional
	public Optional<UserResponse> updateProfile(Long id, UpdateProfileRequest request) {
		return users.findById(id).map(user -> {
			if (request.bio() != null) {
				user.setBio(request.bio());
			}
			if (request.englishLevel() != null) {
				user.setEnglishLevel(request.englishLevel());
			}
			if (request.occupation() != null) {
				user.setOccupation(request.occupation());
			}
			if (request.location() != null) {
				user.setLocation(request.location());
			}
			if (request.avatarUrl() != null) {
				user.setAvatarUrl(request.avatarUrl());
			}
			return UserResponse.from(users.save(user));
		});
	}

	@Transactional
	public Optional<UserResponse> completeOnboarding(Long id, OnboardingRequest request) {
		return users.findById(id).map(user -> {
			user.setEnglishLevel(request.englishLevel());
			user.setAvatarUrl(request.avatarUrl());
			user.setGender(request.gender());
			user.setOccupation(request.occupation());
			user.setLocation(request.location());
			user.setBio(buildBio(user.getName(), request));
			user.setOnboarded(true);
			return UserResponse.from(users.save(user));
		});
	}

	private String buildBio(String name, OnboardingRequest r) {
		String who = name != null && !name.isBlank() ? name : "A learner";
		String occ = r.occupation().replace('_', ' ');
		return String.format(
				"%s — a %s English speaker and %s from %s, here to practise conversation.",
				who, r.englishLevel(), occ, r.location());
	}
}
