package util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelUtil {
	
	//获取Excel表头的方法
	public ArrayList<String> getExcelTitle(String fileDir) throws FileNotFoundException, IOException, InvalidFormatException {
		//定义表头的列表
		ArrayList<String> title = new ArrayList<String>();
		//定义临时字符串变量
		String cellContent = "";
		
		//得到Excel工作簿的对象
		Workbook workBook = null;
		try {
			//创建HSS
			System.out.println("HSSF");
			workBook = new HSSFWorkbook(new FileInputStream(fileDir));
		} catch (Exception e) {
			System.out.println("XSSF");
			workBook = new XSSFWorkbook(new File(fileDir));
		}
		//得到Excel工作表对象（第一张表）
		Sheet sheet = workBook.getSheetAt(0);
		//得到Excel的第一行
		Row firstRow = sheet.getRow(0);
		//得到第一行单元格数量
		int firstRowNum = firstRow.getPhysicalNumberOfCells();
		
		System.out.println("开始遍历...");
		System.out.println("第一行的单元格数量是：" + firstRowNum);
		
		//遍历第一行，将单元格里面的内容写道列表中
		for(int i = 0 ; i < firstRowNum ; i++) {
			//获取单元格内容
			cellContent = firstRow.getCell(i).getStringCellValue();
			System.out.println("表头：" + cellContent);
			//将单元格内容添加到列表中
			title.add(cellContent);
		}
		
		//将工作簿关闭
		workBook.close();
		
		//最后返回表头列表
		return title;
	}
	
	//向Excel文件追加内容的方法
	public void appendContent(ArrayList<String> contents, String fileDir) throws FileNotFoundException, IOException, InvalidFormatException {
		//得到Excel工作簿的对象
		Workbook workBook = null;
		try {
			workBook = new HSSFWorkbook(new FileInputStream(fileDir));
		} catch (Exception e) {
			workBook = new XSSFWorkbook(new File(fileDir));
		}
		//得到Excel工作表对象（第一张表）
		Sheet sheet = workBook.getSheetAt(0);
		//创建新的行
		Row appendRow = sheet.createRow(sheet.getLastRowNum() + 1);
		System.out.println("新添加的行为：" + (sheet.getLastRowNum() + 1));
		
		//定义追加的数量
		int appendLen = contents.size();
		
		//遍历需要追加内容的列表，将数据追加到单元格中
		for(int i = 0 ; i < appendLen ; i++) {
			//创建单元格
			Cell appendCell = appendRow.createCell(i);
			//设置单元格的值
			appendCell.setCellValue(contents.get(i));
			//设置单元格的格式
			appendCell.setCellType(Cell.CELL_TYPE_STRING);
			System.out.println("追加的内容是：" + contents.get(i));
		}
		
		//建立文件的输出流
		FileOutputStream out = new FileOutputStream(fileDir, true);
		//将修改过的写入到输出文件流中
		workBook.write(out);
		
		//将工作簿关闭
		workBook.close();
		//关闭文件输出流
		out.close();
	}
}
