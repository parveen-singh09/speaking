package com.english.speaking.call.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_stats")
@Getter
@Setter
public class UserStats {

	@Id
	@Column(name = "user_id")
	private Long userId;

	@Column(name = "total_call_sec", nullable = false)
	private long totalCallSec;

	@Column(name = "total_calls", nullable = false)
	private int totalCalls;
}
