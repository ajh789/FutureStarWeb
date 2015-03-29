package com.ajh.futurestar.web.test;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class URLDecode {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			String url = URLDecoder.decode("%2Ffuturestar%2Fmanage_class.html%3Fschoolid%3DBBBA7053B3E9EADC5600EC6977437B9F", "UTF-8");
			System.out.println(url);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
