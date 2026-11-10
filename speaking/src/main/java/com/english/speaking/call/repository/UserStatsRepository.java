package com.english.speaking.call.repository;

import com.english.speaking.call.model.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
}
