package com.english.speaking.call.controller;

import com.english.speaking.call.dto.CallSummary;
import com.english.speaking.call.dto.StatsResponse;
import com.english.speaking.call.service.DashboardService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/me")
public class DashboardController {

	private final DashboardService dashboard;

	public DashboardController(DashboardService dashboard) {
		this.dashboard = dashboard;
	}

	@GetMapping("/stats")
	public StatsResponse stats(@AuthenticationPrincipal Long userId) {
		return dashboard.stats(userId);
	}

	@GetMapping("/calls")
	public List<CallSummary> recentCalls(
			@AuthenticationPrincipal Long userId,
			@org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int limit) {
		return dashboard.recentCalls(userId, limit);
	}
}
