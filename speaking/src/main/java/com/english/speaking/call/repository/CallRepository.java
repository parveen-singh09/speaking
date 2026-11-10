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
}
