package com.english.speaking.call.service;

import com.english.speaking.call.model.Call;
import com.english.speaking.call.model.UserStats;
import com.english.speaking.call.repository.CallRepository;
import com.english.speaking.call.repository.UserStatsRepository;
import java.time.Duration;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CallRecordService {

	private final CallRepository calls;
	private final UserStatsRepository stats;

	public CallRecordService(CallRepository calls, UserStatsRepository stats) {
		this.calls = calls;
		this.stats = stats;
	}

	@Transactional
	public void started(Long callerId, Long calleeId) {
		if (calls.findActiveForUser(callerId).isPresent()) {
			return;
		}
		Call call = new Call();
		call.setCallerId(callerId);
		call.setCalleeId(calleeId);
		call.setStatus("active");
		calls.save(call);
	}

	@Transactional
	public void ended(Long userId) {
		calls.findActiveForUser(userId).ifPresent(call -> {
			OffsetDateTime end = OffsetDateTime.now();
			int seconds = (int) Duration.between(call.getStartedAt(), end).toSeconds();
			call.setEndedAt(end);
			call.setDurationSec(seconds);
			call.setStatus("ended");
			calls.save(call);
			bump(call.getCallerId(), seconds);
			bump(call.getCalleeId(), seconds);
		});
	}

	private void bump(Long userId, int seconds) {
		UserStats s = stats.findById(userId).orElseGet(() -> {
			UserStats fresh = new UserStats();
			fresh.setUserId(userId);
			return fresh;
		});
		s.setTotalCallSec(s.getTotalCallSec() + seconds);
		s.setTotalCalls(s.getTotalCalls() + 1);
		stats.save(s);
	}
}
