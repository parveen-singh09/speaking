package com.english.speaking.ws.presence;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PresenceController {

	private final PresenceService presence;

	public PresenceController(PresenceService presence) {
		this.presence = presence;
	}

	@GetMapping("/presence/online")
	public Map<String, Long> onlineCount() {
		return Map.of("count", presence.onlineCount());
	}
}
