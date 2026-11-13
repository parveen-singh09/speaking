package com.english.speaking.call.repository;

import com.english.speaking.call.model.Call;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CallRepository extends JpaRepository<Call, Long> {

	@Query("select c from Call c where c.status = 'active' "
			+ "and (c.callerId = :userId or c.calleeId = :userId)")
	Optional<Call> findActiveForUser(@Param("userId") Long userId);

	@Query("select c from Call c where c.status = 'ended' "
			+ "and (c.callerId = :userId or c.calleeId = :userId) "
			+ "order by c.startedAt desc")
	java.util.List<Call> findRecentForUser(@Param("userId") Long userId,
			org.springframework.data.domain.Pageable pageable);

	@Query("select count(c) > 0 from Call c where "
			+ "(c.callerId = :a and c.calleeId = :b) or "
			+ "(c.callerId = :b and c.calleeId = :a)")
	boolean haveSharedCall(@Param("a") Long a, @Param("b") Long b);
}
