package com.english.speaking.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {

	@ExceptionHandler(InvalidTokenException.class)
	public ResponseEntity<Void> onInvalidToken(InvalidTokenException e) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	}
}
