package com.english.speaking.chat.repository;

import com.english.speaking.chat.model.Message;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

	long countBySenderIdAndRecipientIdAndReadAtIsNull(Long senderId, Long recipientId);

	@Modifying
	@Query("update Message m set m.readAt = :now "
			+ "where m.recipientId = :me and m.senderId = :friend and m.readAt is null")
	int markConversationRead(@Param("me") Long me, @Param("friend") Long friend,
			@Param("now") OffsetDateTime now);

	@Query("select m from Message m where "
			+ "(m.senderId = :a and m.recipientId = :b) or "
			+ "(m.senderId = :b and m.recipientId = :a) "
			+ "order by m.createdAt asc")
	List<Message> findConversation(@Param("a") Long a, @Param("b") Long b);

	@Query("select m from Message m where "
			+ "(m.senderId = :a and m.recipientId = :b) or "
			+ "(m.senderId = :b and m.recipientId = :a) "
			+ "order by m.createdAt desc")
	List<Message> findLatestBetween(@Param("a") Long a, @Param("b") Long b, Pageable pageable);
}
