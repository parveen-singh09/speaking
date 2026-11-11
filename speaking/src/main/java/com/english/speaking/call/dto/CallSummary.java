package com.english.speaking.call.dto;

import com.english.speaking.call.model.Call;
import java.time.OffsetDateTime;

public record CallSummary(
		Long id,
		Long partnerId,
		String partnerName,
		String partnerAvatarUrl,
		Integer durationSec,
		OffsetDateTime startedAt) {

	public static CallSummary of(Call call, Long me, String partnerName, String partnerAvatarUrl) {
		Long partnerId = call.getCallerId().equals(me) ? call.getCalleeId() : call.getCallerId();
		return new CallSummary(call.getId(), partnerId, partnerName, partnerAvatarUrl,
				call.getDurationSec(), call.getStartedAt());
	}
}
