package com.english.speaking.auth.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
}
