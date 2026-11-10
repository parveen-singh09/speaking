package com.english.speaking.chat.repository;

import com.english.speaking.chat.model.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

	@Query("select m from Message m where "
			+ "(m.senderId = :a and m.recipientId = :b) or "
			+ "(m.senderId = :b and m.recipientId = :a) "
			+ "order by m.createdAt asc")
	List<Message> findConversation(@Param("a") Long a, @Param("b") Long b);
}
