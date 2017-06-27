package com.bochum.security;

import com.bochum.exception.MessageException;

public class UserLoginException extends MessageException {

	private static final long serialVersionUID = 1L;

	public UserLoginException() {
		super();

	}

	public UserLoginException(Class clz, String method, Throwable cause) {
		super(clz, method, cause);

	}

	public UserLoginException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);

	}

	public UserLoginException(String message, Throwable cause) {
		super(message, cause);

	}

	public UserLoginException(String message) {
		super(message);

	}

	public UserLoginException(Throwable cause) {
		super(cause);

	}

}
