package com.english.speaking.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.english.speaking.auth.exception.InvalidTokenException;
import java.time.Duration;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

	private final JwtService jwt = new JwtService(
			"test-secret-0123456789-0123456789-0123456789",
			Duration.ofMinutes(15), Duration.ofDays(30));

	@Test
	void accessToken_roundTrips_andIsNotRefresh() {
		String token = jwt.issueAccess(42L);
		assertThat(jwt.parseUserId(token)).isEqualTo(42L);
		assertThat(jwt.isRefresh(token)).isFalse();
	}

	@Test
	void refreshToken_roundTrips_andIsRefresh() {
		String token = jwt.issueRefresh(7L);
		assertThat(jwt.parseUserId(token)).isEqualTo(7L);
		assertThat(jwt.isRefresh(token)).isTrue();
	}

	@Test
	void tamperedToken_isRejected() {
		String token = jwt.issueAccess(1L);
		String tampered = token.substring(0, token.length() - 2) + "xx";
		assertThatThrownBy(() -> jwt.parseUserId(tampered)).isInstanceOf(InvalidTokenException.class);
		assertThat(jwt.isRefresh(tampered)).isFalse();
	}

	@Test
	void expiredToken_isRejected() {
		var expired = new JwtService(
				"test-secret-0123456789-0123456789-0123456789",
				Duration.ofSeconds(-1), Duration.ofSeconds(-1));
		String token = expired.issueAccess(1L);
		assertThatThrownBy(() -> expired.parseUserId(token)).isInstanceOf(InvalidTokenException.class);
	}
}
