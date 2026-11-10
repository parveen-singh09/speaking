package com.english.speaking.turn.dto;

public record IceServer(String urls, String username, String credential) {

	public static IceServer stun(String urls) {
		return new IceServer(urls, null, null);
	}
}
