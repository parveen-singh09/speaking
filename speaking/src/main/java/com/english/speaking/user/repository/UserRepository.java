package com.english.speaking.user.repository;

import com.english.speaking.user.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByGoogleSub(String googleSub);

	Optional<User> findByEmail(String email);

	@Query("select u from User u where u.onboarded = true and u.id <> :excludeId "
			+ "and (:name is null or lower(u.name) like lower(concat('%', :name, '%'))) "
			+ "and (:location is null or u.location = :location) "
			+ "and (:level is null or u.englishLevel = :level) "
			+ "order by u.name asc")
	List<User> searchUsers(@Param("excludeId") Long excludeId, @Param("name") String name,
			@Param("location") String location, @Param("level") String level, Pageable pageable);
}
