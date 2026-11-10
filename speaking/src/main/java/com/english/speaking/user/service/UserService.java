package com.english.speaking.user.service;

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
}
