package com.english.speaking.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DbKeepAlive {

	private static final Logger log = LoggerFactory.getLogger(DbKeepAlive.class);

	private final JdbcTemplate jdbc;

	public DbKeepAlive(JdbcTemplate jdbc) {
		this.jdbc = jdbc;
	}

	@Scheduled(fixedRate = 240_000)
	public void ping() {
		try {
			jdbc.queryForObject("SELECT 1", Integer.class);
		} catch (Exception e) {
			log.warn("DB keep-alive ping failed: {}", e.getMessage());
		}
	}
}
