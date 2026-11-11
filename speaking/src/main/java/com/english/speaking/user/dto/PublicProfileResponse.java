package com.english.speaking.user.dto;

public record PublicProfileResponse(
		Long userId,
		String name,
		String avatarUrl,
		String bio,
		String englishLevel,
		String occupation,
		String location,
		boolean online,
		long totalCalls,
		long totalCallSec,
		long friends) {}
