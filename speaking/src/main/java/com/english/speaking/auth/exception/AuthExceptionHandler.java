package com.english.speaking.auth.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class AuthExceptionHandler {

	@ExceptionHandler(InvalidTokenException.class)
	public ResponseEntity<Void> onInvalidToken(InvalidTokenException e) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> onValidation(MethodArgumentNotValidException e) {
		var field = e.getBindingResult().getFieldError();
		String message = field != null ? field.getDefaultMessage() : "Invalid request";
		return ResponseEntity.badRequest().body(Map.of("message", message));
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> onStatus(ResponseStatusException e) {
		HttpStatusCode status = e.getStatusCode();
		String message = e.getReason() != null ? e.getReason() : "Request failed";
		return ResponseEntity.status(status).body(Map.of("message", message));
	}
}
