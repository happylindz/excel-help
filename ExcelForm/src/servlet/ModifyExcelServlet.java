package servlet;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import util.ExcelUtil;
import util.Source;

@WebServlet("/servlet/ModifyExcelServlet")
public class ModifyExcelServlet extends HttpServlet {
	
	//����ExcelUtil����
	private ExcelUtil excelUtil = new ExcelUtil();
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//�����ַ���Ϊutf-8
		response.setContentType("text/xml;utf-8");
		//��ȡд��
		PrintWriter writer = response.getWriter();
		
		//��ȡ�ļ�������
		String excelFileName = request.getParameter("file_name").toString();
		
		//�����ͷ
		ArrayList<String> title = null;
		try {
			title = excelUtil.getExcelTitle(Source.excelStoreURL + "/" + excelFileName);
			//��ȡ����
			int colLength = title.size();
			
			//������дֵ���б�
			ArrayList<String> inputValues = new ArrayList<String>();
			//��������ı���������Щ������ֵ�ŵ��б���
			for(int i = 0 ; i < colLength ; i++) {
				//��ȡ�����ֵ������Щֵ�ŵ��б���
				inputValues.add(request.getParameter("input" + i).toString());
			}
			
			//�������ɹ��󣬽����ݷŵ�Excel��
			excelUtil.appendContent(inputValues, Source.excelStoreURL + "/" + excelFileName);
			
			//����ɹ��Ļ��������سɹ���ʾ
			writer.write("success");
			writer.flush();
		} catch (InvalidFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//������ɹ����򷵻�fail
			writer.write("fail");
			writer.flush();
		}
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//����doPost�ķ���
		doPost(req, resp);
	}

}
