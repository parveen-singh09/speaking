package com.english.speaking.ws.dto;

import tools.jackson.databind.JsonNode;

public record Envelope(String type, String to, JsonNode payload) {}
