package jp.co.fpt.excel;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public class ExportToExcelFile {
	
	private UserData userData;
	
	/**
	 * Export UserData to excel file
	 * @param tmplpath: template file path
	 * @param savepath: save file path
	 */
	public void exportData(String tmplpath, String savepath) {
		try {
			InputStream inp = new FileInputStream(tmplpath);
		    //InputStream inp = new FileInputStream("workbook.xlsx");

			HSSFWorkbook wb=new HSSFWorkbook(inp);
			HSSFSheet st=wb.getSheet("Timesheet");
			
			setCellValue( st, 3, 3, userData.getUserName() );
			
			setCellValue( st, 6, 4, userData.getMonth() );
			
			setCellValue( st, 6, 5, userData.getYear() );
			
			int length = userData.getTimeData().size();
			for(int i=0; i<length; i++) {
				ArrayList<String> list = userData.getTimeData().get(i);
				int rowI = 10 + i;
				
				for (int j = 0; j < list.size(); j ++){
					//Time
					if (UserData.DATA_TYPE[j] == 1){
						String time = list.get(j);
						if (time == null || "".equals(time)) continue;
						
						int[] H_M = UserData.getH_M( list.get(j) );
						setCellValue( st, rowI, j, (H_M[0] + H_M[1]/60d)/24d );
					}
					//String
					else if (UserData.DATA_TYPE[j] == 2){
						setCellValue( st, rowI, j, list.get(j) );
					}
				}
			}
			
			// Write the output to a file
			FileOutputStream fileOut = new FileOutputStream(savepath);
			
			wb.write(fileOut);
			inp.close(); 
			wb.close();
			fileOut.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public UserData getUserData() {
		return userData;
	}

	public void setUserData(UserData userData) {
		this.userData = userData;
	}
	
	/**
	 * Set cell value with several types
	 * @param st
	 * @param R
	 * @param C
	 * @param val
	 */
	private void setCellValue( HSSFSheet st, int R, int C, String val ) {		
		HSSFCell cell = getCell(st, R, C);
		cell.setCellValue(val);
	}
	
	private void setCellValue( HSSFSheet st, int R, int C, int val ) {		
		HSSFCell cell = getCell(st, R, C);
		cell.setCellValue(val);
	}
	
	private void setCellValue( HSSFSheet st, int R, int C, double val ) {		
		HSSFCell cell = getCell(st, R, C);
		cell.setCellValue(val);
	}
	
	/**
	 * 
	 * @param st
	 * @param R
	 * @param C
	 * @return
	 */
	private HSSFCell getCell( HSSFSheet st, int R, int C ){
		HSSFRow row=st.getRow(R);
		if (row==null) row = st.createRow(R);
		HSSFCell cell= row.getCell(C);
		if (cell == null)	cell = row.createCell(C);
		
		return cell;
	}
}
