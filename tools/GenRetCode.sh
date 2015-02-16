#!/bin/bash -

RetCode="\
RETCODE_OK \
RETCODE_KO \
RETCODE_KO_NULL_REQ_SOURCE \
RETCODE_KO_UNKNOWN_REQ_SOURCE \
RETCODE_KO_LOGIN_FAILED \
RETCODE_KO_NOTLOGIN_OR_TIMEOUT \
RETCODE_KO_DB_OPEN_CONN_FAILED \
RETCODE_KO_DB_CLOSE_CONN_FAILED \
RETCODE_KO_DB_CREATE_STMT_FAILED \
RETCODE_KO_DB_CLOSE_STMT_FAILED \
RETCODE_KO_UNKNOWN_DB_ACTION \
RETCODE_KO_MANAGE_SCHOOL_NULL_ACTION \
RETCODE_KO_MANAGE_SCHOOL_NULL_NAME \
RETCODE_KO_MANAGE_SCHOOL_SELECT_FAILED \
RETCODE_KO_MANAGE_SCHOOL_INSERT_FAILED \
RETCODE_KO_MANAGE_SCHOOL_UPDATE_FAILED \
RETCODE_KO_MANAGE_SCHOOL_DELETE_FAILED \
RETCODE_KO_MANAGE_TEACHER_NULL_ACTION \
RETCODE_KO_MANAGE_TEACHER_SELECT_FAILED \
RETCODE_KO_MANAGE_TEACHER_INSERT_FAILED \
RETCODE_KO_MANAGE_TEACHER_UPDATE_FAILED \
RETCODE_KO_MANAGE_TEACHER_DELETE_FAILED \
RETCODE_KO_MANAGE_CLASS_TABLES_NULL_ACTION \
RETCODE_KO_MANAGE_CLASS_TABLES_NULL_SCHOOLID \
RETCODE_KO_MANAGE_CLASS_TABLES_SELECT_FAILED \
"

GenJava()
{
	DIRNAME='../src/com/ajh/futurestar/web/common'
	BASENAME='RetCode.java'
	FILE="$DIRNAME/$BASENAME"

	cat > $FILE <<- EOF
	// $BASENAME
	/*
	 * This is an auto-generated source file.
	 */
	
	package com.ajh.futurestar.web.common;
	
	public enum RetCode {
	EOF

	for RC in $RetCode
	do
		echo -e "\t$RC," >> $FILE
	done

	cat >> $FILE <<- EOF
	}
	
	// End of file
	EOF

	# Reverse file content and remove first ','.
	tac $FILE | sed '1,/,/s~,~~' > ${FILE}.tmp
	# Reverse file content
	tac ${FILE}.tmp > $FILE

	rm -f ${FILE}.tmp
}

GenJS()
{
	DIRNAME='../WebContent/js'
	BASENAME='retcode.js'
	FILE="$DIRNAME/$BASENAME"

	cat > $FILE <<- EOF
	// $BASENAME
	/*
	 * This is an auto-generated source file.
	 */
	
	var RetCode = {
	EOF

	VAL=0
	for RC in $RetCode
	do
		echo -e "\t'$RC': $VAL," >> $FILE
		VAL=$(($VAL + 1))
	done

	cat >> $FILE <<- EOF
	};
	
	// End of file
	EOF

	# Reverse file content and remove first ','.
	tac $FILE | sed '1,/,/s~,~~' > ${FILE}.tmp
	# Reverse file content
	tac ${FILE}.tmp > $FILE

	rm -f ${FILE}.tmp
}

for RC in $RetCode
do
  echo Code: $RC
done

GenJava
GenJS

# Keep last line