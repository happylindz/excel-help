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
	
	//��ȡExcel��ͷ�ķ���
	public ArrayList<String> getExcelTitle(String fileDir) throws FileNotFoundException, IOException, InvalidFormatException {
		//�����ͷ���б�
		ArrayList<String> title = new ArrayList<String>();
		//������ʱ�ַ�������
		String cellContent = "";
		
		//�õ�Excel�������Ķ���
		Workbook workBook = null;
		try {
			//����HSS
			System.out.println("HSSF");
			workBook = new HSSFWorkbook(new FileInputStream(fileDir));
		} catch (Exception e) {
			System.out.println("XSSF");
			workBook = new XSSFWorkbook(new File(fileDir));
		}
		//�õ�Excel��������󣨵�һ�ű�
		Sheet sheet = workBook.getSheetAt(0);
		//�õ�Excel�ĵ�һ��
		Row firstRow = sheet.getRow(0);
		//�õ���һ�е�Ԫ������
		int firstRowNum = firstRow.getPhysicalNumberOfCells();
		
		System.out.println("��ʼ����...");
		System.out.println("��һ�еĵ�Ԫ�������ǣ�" + firstRowNum);
		
		//������һ�У�����Ԫ�����������д���б���
		for(int i = 0 ; i < firstRowNum ; i++) {
			//��ȡ��Ԫ������
			cellContent = firstRow.getCell(i).getStringCellValue();
			System.out.println("��ͷ��" + cellContent);
			//����Ԫ��������ӵ��б���
			title.add(cellContent);
		}
		
		//���������ر�
		workBook.close();
		
		//��󷵻ر�ͷ�б�
		return title;
	}
	
	//��Excel�ļ�׷�����ݵķ���
	public void appendContent(ArrayList<String> contents, String fileDir) throws FileNotFoundException, IOException, InvalidFormatException {
		//�õ�Excel�������Ķ���
		Workbook workBook = null;
		try {
			workBook = new HSSFWorkbook(new FileInputStream(fileDir));
		} catch (Exception e) {
			workBook = new XSSFWorkbook(new File(fileDir));
		}
		//�õ�Excel��������󣨵�һ�ű�
		Sheet sheet = workBook.getSheetAt(0);
		//�����µ���
		Row appendRow = sheet.createRow(sheet.getLastRowNum() + 1);
		System.out.println("����ӵ���Ϊ��" + (sheet.getLastRowNum() + 1));
		
		//����׷�ӵ�����
		int appendLen = contents.size();
		
		//������Ҫ׷�����ݵ��б�������׷�ӵ���Ԫ����
		for(int i = 0 ; i < appendLen ; i++) {
			//������Ԫ��
			Cell appendCell = appendRow.createCell(i);
			//���õ�Ԫ���ֵ
			appendCell.setCellValue(contents.get(i));
			//���õ�Ԫ��ĸ�ʽ
			appendCell.setCellType(Cell.CELL_TYPE_STRING);
			System.out.println("׷�ӵ������ǣ�" + contents.get(i));
		}
		
		//�����ļ��������
		FileOutputStream out = new FileOutputStream(fileDir, true);
		//���޸Ĺ���д�뵽����ļ�����
		workBook.write(out);
		
		//���������ر�
		workBook.close();
		//�ر��ļ������
		out.close();
	}
}
