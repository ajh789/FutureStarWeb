package com.ajh.futurestar.web.common;

public class Request {
	public static final String PARAM_REQFROM = "reqfrom";
	public static final String VALUE_REQFROM_PC = "pc";
	public static final String VALUE_REQFROM_WAP = "wap";
	public static final String VALUE_REQFROM_UNKNOWN = "unknown";
	public static final String VALUE_REQFROM_NULL = "null";

	public static final String PARAM_ACTION = "action";
	public static final String VALUE_ACTION_SELECT = "select";
	public static final String VALUE_ACTION_INSERT = "insert";
	public static final String VALUE_ACTION_UPDATE = "update";
	public static final String VALUE_ACTION_DELETE = "delete";

	//
	// Parameter names for DB action select. Valid for all tables.
	//
	public static final String PARAM_ACTION_SELECT_MODE = "mode"; // Query mode
	public static final int    VALUE_ACTION_SELECT_MODE_BASEID_AND_INCREMENT = 0;
	public static final int    VALUE_ACTION_SELECT_MODE_FROM_TO = 1;

	public static final String PARAM_ACTION_SELECT_BASEID = "baseid";
	public static final int    VALUE_ACTION_SELECT_BASEID_DEFAULT = 0;

	public static final String PARAM_ACTION_SELECT_RANGE = "range";
	public static final int    VALUE_ACTION_SELECT_RANGE_DEFAULT = 5;

	public static final String PARAM_ACTION_SELECT_GOES = "goes"; // UP or DOWN
	public static final int    VALUE_ACTION_SELECT_GOES_UP = 0;
	public static final int    VALUE_ACTION_SELECT_GOES_DOWN = 1;

	public static final String PARAM_ACTION_SELECT_FROMID = "fromid";
	public static final String PARAM_ACTION_SELECT_TOID = "toid";

	public static final String PARAM_SCHOOL_ID = "id";
	public static final String PARAM_SCHOOL_NAME = "name";
	public static final String PARAM_SCHOOL_INTRO = "intro";

	public static final String PARAM_TEACHER_NAME = "name";
	public static final String PARAM_TEACHER_MOBILENUM = "mobilenum";
	public static final String PARAM_TEACHER_SCHOOLNAME = "schoolname";

}
