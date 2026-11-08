package com.english.speaking.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String code) {}
