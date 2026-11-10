package com.english.speaking.call.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "calls")
@Getter
@Setter
public class Call {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "caller_id", nullable = false)
	private Long callerId;

	@Column(name = "callee_id", nullable = false)
	private Long calleeId;

	@Column(name = "started_at", insertable = false, updatable = false)
	private OffsetDateTime startedAt;

	@Column(name = "ended_at")
	private OffsetDateTime endedAt;

	@Column(name = "duration_sec")
	private Integer durationSec;

	private String status;
}
