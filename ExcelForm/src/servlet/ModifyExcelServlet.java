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
	
	//定义ExcelUtil对象
	private ExcelUtil excelUtil = new ExcelUtil();
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		//设置字符集为utf-8
		response.setContentType("text/xml;utf-8");
		//获取写者
		PrintWriter writer = response.getWriter();
		
		//获取文件的名字
		String excelFileName = request.getParameter("file_name").toString();
		
		//定义表头
		ArrayList<String> title = null;
		try {
			title = excelUtil.getExcelTitle(Source.excelStoreURL + "/" + excelFileName);
			//获取列数
			int colLength = title.size();
			
			//定义填写值的列表
			ArrayList<String> inputValues = new ArrayList<String>();
			//遍历输入的变量，将这些变量的值放到列表中
			for(int i = 0 ; i < colLength ; i++) {
				//获取输入的值，将这些值放到列表中
				inputValues.add(request.getParameter("input" + i).toString());
			}
			
			//当便利成功后，将数据放到Excel中
			excelUtil.appendContent(inputValues, Source.excelStoreURL + "/" + excelFileName);
			
			//如果成功的话，将返回成功提示
			writer.write("success");
			writer.flush();
		} catch (InvalidFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			//如果不成功，则返回fail
			writer.write("fail");
			writer.flush();
		}
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		//调用doPost的方法
		doPost(req, resp);
	}

}
