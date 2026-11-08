package com.english.speaking.auth.exception;

public class InvalidTokenException extends RuntimeException {

	public InvalidTokenException(Throwable cause) {
		super("Invalid or expired token", cause);
	}
}
