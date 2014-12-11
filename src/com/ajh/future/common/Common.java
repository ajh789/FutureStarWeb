package com.ajh.future.common;

public class Common {

	public enum RetCode {
		RETCODE_OK,
		RETCODE_KO,
		RETCODE_KO_NULL_REQ_SOURCE,
		RETCODE_KO_UNKNOWN_REQ_SOURCE,
		RETCODE_KO_LOGIN_FAILED,
		RETCODE_KO_NOTLOGIN_OR_TIMEOUT
	}

	public class Request {
		public static final String FROM_PC = "pc";
		public static final String FROM_WAP = "wap";
		public static final String FROM_UNKNOWN = "unknown";
		public static final String FROM_NULL = "null";
	}

}
