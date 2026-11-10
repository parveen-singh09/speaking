package com.english.speaking.call.dto;

import com.english.speaking.call.model.Call;
import java.time.OffsetDateTime;

public record CallSummary(
		Long id,
		Long partnerId,
		String partnerName,
		Integer durationSec,
		OffsetDateTime startedAt) {

	public static CallSummary of(Call call, Long me, String partnerName) {
		Long partnerId = call.getCallerId().equals(me) ? call.getCalleeId() : call.getCallerId();
		return new CallSummary(call.getId(), partnerId, partnerName,
				call.getDurationSec(), call.getStartedAt());
	}
}
