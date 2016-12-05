package test;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;

import util.ExcelUtil;

public class ExcelTest {

	public static void main(String[] args) throws FileNotFoundException, IOException, InvalidFormatException {
		String fileDir = "D:/1.xlsx";
		ExcelUtil excelUtil = new ExcelUtil();
		excelUtil.getExcelTitle(fileDir);
		
		ArrayList<String> testList = new ArrayList<String>();
		testList.add("kill");
		testList.add("ppp");
		testList.add("ooo");
		excelUtil.appendContent(testList, fileDir);
	}

}
