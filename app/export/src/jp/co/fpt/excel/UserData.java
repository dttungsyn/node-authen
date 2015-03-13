package jp.co.fpt.excel;

import java.util.ArrayList;

public class UserData {
	
	private String userName;
	
	private int month;
	
	private int year;
	
	private ArrayList<ArrayList<String>> timeData;
	
	/*
	 * 0: not touch
	 * 1: datetime
	 * 2: string
	 */
	public static int[] DATA_TYPE = new int[]{0,0,2,1,1,1,1,1,1,0,0,0,0,0,0,0,2,2};
	
	public UserData(){
	}
	
//	public UserData(String userName, int month, int year, ArrayList<ArrayList<Integer>> timeData){
//		this.userName = userName;
//		this.month = month;
//		this.year = year;
//		this.timeData = timeData;
//	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public ArrayList<ArrayList<String>> getTimeData() {
		return timeData;
	}

	public void setTimeData(ArrayList<ArrayList<String>> timeData) {
		this.timeData = timeData;
	}
	
	/**
	 * define each col type
	 * @param dataType
	 */
	public void setDataType(int[] dataType){
		UserData.DATA_TYPE = dataType;
	}
	
	/**
	 * Change 'HH:mm' to array of hour and minute [h,m]
	 * @param time
	 * @return
	 */
	public static int[] getH_M(String time){
		String[] H_Mstr = time.split(":");
		int[] H_M = new int[2];
		H_M[0] = Integer.parseInt(H_Mstr[0]);
		H_M[1] = Integer.parseInt(H_Mstr[1]);
		
		return H_M;
	}

}
