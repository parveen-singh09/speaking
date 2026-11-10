package com.english.speaking.user.repository;

import com.english.speaking.user.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	// Day 3 upserts by Google 'sub'; defined now since it costs nothing.
	Optional<User> findByGoogleSub(String googleSub);

	Optional<User> findByEmail(String email);
}
