package com.bochum.exception;

public class MessageException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public MessageException() {
		super();
	}

	public MessageException(Class clz, String method, Throwable cause) {
		super(cause);
	}

	public MessageException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

	public MessageException(String message, Throwable cause) {
		super(message, cause);
	}

	public MessageException(String message) {
		super(message);
	}

	public MessageException(Throwable cause) {
		super(cause);
	}

}
