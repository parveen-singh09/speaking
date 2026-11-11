package com.english.speaking.user.repository;

import com.english.speaking.user.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByGoogleSub(String googleSub);

	Optional<User> findByEmail(String email);

	java.util.List<User> findTop20ByOnboardedTrueAndNameContainingIgnoreCaseAndIdNot(
			String name, Long excludeId);
}
