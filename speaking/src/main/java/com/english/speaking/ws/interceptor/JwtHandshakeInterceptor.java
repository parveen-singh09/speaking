package com.english.speaking.ws.interceptor;

import com.english.speaking.auth.exception.InvalidTokenException;
import com.english.speaking.auth.service.JwtService;
import java.util.Map;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

	public static final String USER_ID = "userId";

	private final JwtService jwt;

	public JwtHandshakeInterceptor(JwtService jwt) {
		this.jwt = jwt;
	}

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
			WebSocketHandler wsHandler, Map<String, Object> attributes) {
		String token = UriComponentsBuilder.fromUri(request.getURI()).build()
				.getQueryParams().getFirst("token");
		if (token == null) {
			return false;
		}
		try {
			attributes.put(USER_ID, jwt.parseUserId(token));
			return true;
		} catch (InvalidTokenException e) {
			return false;
		}
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
			WebSocketHandler wsHandler, Exception exception) {
	}
}
