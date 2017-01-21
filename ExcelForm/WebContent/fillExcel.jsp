<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@ page import="util.*" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!--引入上传文件控件的css文件-->
    <link href="file-input/css/fileinput.min.css" rel="stylesheet">
    
    <!-- 引入sweetalert -->
    <link href="sweetalert/css/sweetalert.css" rel="stylesheet">

    <!--我的css文件-->
    <link href="default/css/default.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="bootstrap/additional_js/html5shiv.js"></script>
    <script src="bootstrap/additional_js/respond.js"></script>
    <![endif]-->
</head>
<body class="container">
	
	<!-- 初始化Excel的文件内容 -->
	<%
		//获取文件的名字
		String excelFileName = request.getParameter("file_name").toString();
	
		//定义ExcelUtil对象
		ExcelUtil excelUtil = new ExcelUtil();
		
		//获取该Excel文件的表头
		ArrayList<String> title = excelUtil.getExcelTitle(Source.excelStoreURL + "/" + excelFileName);
	%>

    <!-- 巨幕作为该网页的标题-->
    <div class="row">
        <div class="jumbotron">
            <h1>让填表格更简单</h1>
            <p>乖乖填好表格然后交给班长吧:)</p>
        </div>
    </div>

    <!--需要填写的表单-->
    <div class="row">
        <!--显示表的名称-->
        <h2><strong class="text-info">你现在填写的表是：<%=excelFileName %></strong></h2>
        <hr>
        <form id="excel_form" role="form" action="servlet/ModifyExcelServlet">
        	
        	<div class="form-group">
        		<label for="file_name_input">表名</label>
        		<input type="text" id="file_name_input" name="file_name" class="form-control" readonly value="<%=excelFileName %>">
        	</div>
        	<!-- 遍历标题 -->
        	<%	
        		//获取标题的长度
        		int titleLength = title.size();
        		for(int i = 0 ; i < titleLength ; i++) {
        	%>
        		<!-- 创建一个子项 -->
	            <div class="form-group">
	                <label for="<%="input" + i %>"><%=title.get(i) %></label>
	                <input type="text" name="<%="input" + i %>" id="<%="input" + i %>" class="form-control" placeholder="<%="请输入" + title.get(i)%>">
	            </div>
            <%
        		}
            %>

            <!--显示提交按钮的div-->
            <div class="">
                <button type="button" class="btn btn-primary" onclick="submitExcel(); return false;">提交</button>
                <button type="reset" class="btn btn-danger">重置</button>
            </div>
        </form>
    </div>

    <!--脚注-->
    <div class="row">
        <footer class="text-center">
            <hr>
            <h4>Excel填表开发者@2016</h4>
        </footer>
    </div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="bootstrap/additional_js/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="bootstrap/js/bootstrap.min.js"></script>

<!--引入上传文件的js文件-->
<script src="file-input/js/fileinput.min.js"></script>
<script src="file-input/js/fileinput_locale_zh.js"></script>

<!-- 引入sweetalert的js文件 -->
<script src="sweetalert/js/sweetalert.min.js"></script>

<!--我的js文件-->
<script src="client/js/client.js"></script>

</body>
</html>