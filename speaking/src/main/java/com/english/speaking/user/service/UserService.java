package com.english.speaking.user.service;

import com.english.speaking.user.dto.OnboardingRequest;
import com.english.speaking.user.dto.UpdateProfileRequest;
import com.english.speaking.user.dto.UserResponse;
import com.english.speaking.user.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

	private final UserRepository users;

	public UserService(UserRepository users) {
		this.users = users;
	}

	public Optional<UserResponse> getById(Long id) {
		return users.findById(id).map(UserResponse::from);
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
