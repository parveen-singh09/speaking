package com.english.speaking.turn.controller;

import com.english.speaking.turn.dto.IceServer;
import com.english.speaking.turn.service.TurnService;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/turn")
public class TurnController {

	private final TurnService turn;

	public TurnController(TurnService turn) {
		this.turn = turn;
	}

	@GetMapping
	public List<IceServer> iceServers(@AuthenticationPrincipal Long userId) {
		return turn.iceServers(userId);
	}
}
