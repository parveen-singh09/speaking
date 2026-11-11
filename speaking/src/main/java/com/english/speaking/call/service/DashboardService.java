package com.english.speaking.call.service;

import com.english.speaking.call.dto.CallSummary;
import com.english.speaking.call.dto.StatsResponse;
import com.english.speaking.call.model.Call;
import com.english.speaking.call.repository.CallRepository;
import com.english.speaking.call.repository.UserStatsRepository;
import com.english.speaking.user.repository.UserRepository;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

	private final CallRepository calls;
	private final UserStatsRepository stats;
	private final UserRepository users;

	public DashboardService(CallRepository calls, UserStatsRepository stats, UserRepository users) {
		this.calls = calls;
		this.stats = stats;
		this.users = users;
	}

	public StatsResponse stats(Long userId) {
		return stats.findById(userId)
				.map(s -> new StatsResponse(s.getTotalCallSec(), s.getTotalCalls()))
				.orElse(new StatsResponse(0, 0));
	}

	public List<CallSummary> recentCalls(Long userId) {
		return recentCalls(userId, 10);
	}

	public List<CallSummary> recentCalls(Long userId, int limit) {
		int capped = Math.max(1, Math.min(limit, 200));
		return calls.findRecentForUser(userId, PageRequest.of(0, capped)).stream()
				.map(call -> {
					Long partnerId = call.getCallerId().equals(userId)
							? call.getCalleeId() : call.getCallerId();
					var partner = users.findById(partnerId).orElse(null);
					String name = partner != null ? partner.getName() : null;
					String avatarUrl = partner != null ? partner.getAvatarUrl() : null;
					return CallSummary.of(call, userId, name, avatarUrl);
				})
				.toList();
	}
}
