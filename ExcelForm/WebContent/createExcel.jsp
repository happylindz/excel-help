<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
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

    <!-- 巨幕作为该网页的标题-->
    <div class="row">
        <div class="jumbotron">
            <h1>让填表格更简单</h1>
            <p>你可以上传表格后将链接分享给你的同学，让他们填去吧:)</p>
            <p>
                <!--显示按钮用于打开Excel文件-->
                <a class="btn btn-success btn-lg" href="#select_file_div" role="button">上传一个Excel</a>
            </p>
        </div>
    </div>

    <!--分割行-->
    <div class="row">
        <h2><strong>具体步骤</strong></h2>
    </div>

    <!--显示具体步骤-->
    <div class="row">
        <!--第一步的面板-->
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3><strong>第一步</strong></h3>
            </div>
            <div class="panel-body">
                <h4><strong>上传你的Excel文件</strong></h4>
            </div>
        </div>

        <!--显示第二步的面板-->
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3><strong>第二步</strong></h3>
            </div>
            <div class="panel-body">
                <h4><strong>分享你的Excel文件链接</strong></h4>
            </div>
        </div>

        <!--显示第三步的面板-->
        <div class="panel panel-success">
            <div class="panel-heading">
                <div class="panel-title">
                    <h1><strong>第三步</strong></h1>
                </div>
            </div>
            <div class="panel-body">
                <h4><strong>同学们自主填写Excel表格</strong></h4>
            </div>
        </div>
    </div>

    <!--分隔行-->
    <div class="row">
        <hr>
        <div class="col-sm-12 text-center">
            <h1><strong>现在就开始上传你的Excel吧</strong></h1>
        </div>
    </div>

    <!--选择Excel文件的输入框组件-->
    <div id="select_file_div" class="row">
    
    	<!-- 提交Excel文件的表单 -->
    	<form id="excel_form" enctype="multipart/form-data" action="servlet/UploadExcelServlet">
    		<div class="control-group">
    			<label class="control-label"><strong>选择你要上传的Excel文件（每次上传一个Excel文件）</strong></label>
    			
    			<!-- 选择Excel文件的控件 -->
		        <input id="excel_input" name="excel_file" type="file" class="file">
    		</div>
    		
<!--     		提交的按钮 -->
			<div class="row text-center">
				<button class="btn btn-success" onclick="uploadExcel(); return false;">上传Excel文件</button>
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
<script src="admin/js/admin.js"></script>

</body>
</html>
