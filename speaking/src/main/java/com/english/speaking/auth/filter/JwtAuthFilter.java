package com.english.speaking.auth.filter;

import com.english.speaking.auth.exception.InvalidTokenException;
import com.english.speaking.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private static final String BEARER = "Bearer ";

	private final JwtService jwt;

	public JwtAuthFilter(JwtService jwt) {
		this.jwt = jwt;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain chain) throws ServletException, IOException {

		String header = request.getHeader("Authorization");
		org.slf4j.LoggerFactory.getLogger(JwtAuthFilter.class).info(
				"[req] {} {} auth={}", request.getMethod(), request.getRequestURI(),
				header == null ? "none" : header.substring(0, Math.min(20, header.length())));
		if (header != null && header.startsWith(BEARER)) {
			try {
				Long userId = jwt.parseUserId(header.substring(BEARER.length()));
				var auth = new UsernamePasswordAuthenticationToken(userId, null, List.of());
				SecurityContextHolder.getContext().setAuthentication(auth);
			} catch (InvalidTokenException e) {
				logger.debug("Rejected JWT: " + e.getMessage());
			}
		}
		chain.doFilter(request, response);
	}
}
