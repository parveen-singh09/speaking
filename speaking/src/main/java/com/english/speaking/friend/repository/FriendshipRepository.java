package com.english.speaking.friend.repository;

import com.english.speaking.friend.model.Friendship;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

	@Query("select f from Friendship f where f.status = 'accepted' "
			+ "and (f.requesterId = :userId or f.addresseeId = :userId)")
	List<Friendship> findAcceptedForUser(@Param("userId") Long userId);

	List<Friendship> findByAddresseeIdAndStatus(Long addresseeId, String status);

	Optional<Friendship> findByRequesterIdAndAddresseeId(Long requesterId, Long addresseeId);

	@Query("select count(f) > 0 from Friendship f where f.status = 'accepted' and ("
			+ "(f.requesterId = :a and f.addresseeId = :b) or "
			+ "(f.requesterId = :b and f.addresseeId = :a))")
	boolean areFriends(@Param("a") Long a, @Param("b") Long b);
}
