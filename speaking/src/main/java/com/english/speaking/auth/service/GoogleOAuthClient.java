package com.english.speaking.auth.service;

import com.english.speaking.auth.dto.GoogleUser;
import com.english.speaking.auth.exception.InvalidTokenException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class GoogleOAuthClient {

	private final RestClient http;
	private final ObjectMapper mapper;
	private final String clientId;
	private final String clientSecret;
	private final String redirectUri;
	private final String tokenUri;

	public GoogleOAuthClient(
			@Value("${app.google.client-id}") String clientId,
			@Value("${app.google.client-secret}") String clientSecret,
			@Value("${app.google.redirect-uri}") String redirectUri,
			@Value("${app.google.token-uri}") String tokenUri,
			ObjectMapper mapper) {
		this.http = RestClient.create();
		this.mapper = mapper;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;
		this.tokenUri = tokenUri;
	}

	public GoogleUser exchangeCode(String code) {
		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
		form.add("code", code);
		form.add("client_id", clientId);
		form.add("client_secret", clientSecret);
		form.add("redirect_uri", redirectUri);
		form.add("grant_type", "authorization_code");

		JsonNode body;
		try {
			body = http.post()
					.uri(tokenUri)
					.contentType(MediaType.APPLICATION_FORM_URLENCODED)
					.body(form)
					.retrieve()
					.body(JsonNode.class);
		} catch (Exception e) {
			throw new InvalidTokenException(e);
		}
		if (body == null || !body.hasNonNull("id_token")) {
			throw new InvalidTokenException(new IllegalStateException("No id_token in Google response"));
		}
		return parseIdToken(body.get("id_token").asText());
	}

	private GoogleUser parseIdToken(String idToken) {
		try {
			String[] parts = idToken.split("\\.");
			String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]));
			JsonNode claims = mapper.readTree(payloadJson);
			return new GoogleUser(
					claims.get("sub").asText(),
					claims.get("email").asText(),
					claims.path("name").asText(null),
					claims.path("picture").asText(null));
		} catch (Exception e) {
			throw new InvalidTokenException(e);
		}
	}
}
