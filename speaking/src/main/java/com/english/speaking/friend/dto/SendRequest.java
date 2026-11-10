package com.english.speaking.friend.dto;

import jakarta.validation.constraints.NotNull;

public record SendRequest(@NotNull Long addresseeId) {}
