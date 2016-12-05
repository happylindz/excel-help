//初始化fileinput控件（第一次初始化）
$('#excel_input').fileinput({
	language: 'zh', //设置语言
    uploadUrl: "servlet/UploadExcelServlet", //上传的地址
    allowedFileExtensions : ['xlsx', 'xls', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam'],//接收的文件后缀,
    maxFileCount: 1,		//最多可以传一个文件
    enctype: 'multipart/form-data',
    showUpload: false, //是否显示上传按钮
    showCaption: false,//是否显示标题
    browseClass: "btn btn-primary", //按钮样式             
    previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
    msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
});

function uploadExcel() {
	
	//判断是否上传文件是否为空
	var excelFile = document.getElementById("excel_form").value;
	
	//获取Excel文件的信息
	var excelForm = document.getElementById("excel_form");
	//生成FormData对象
	var excelFile = new FormData(excelForm);
	
	
	//进行用户注册信息的上传
	$.ajax({
		cache: false,
		type: "POST",
		url:"servlet/UploadExcelServlet",
		data:excelFile,// 你的formid
		processData:false,//data的值是对象
		contentType:false,//已经声明类型为multipart
		dataType:"text",	//返回纯字符串类型
		async: true,
		error: function(request) {
			swal({   title: "上传失败",   type: "error",   confirmButtonText: "OK" });
		},
		success: function(data) {
			
			//获取返回结果
			var result = data.split('&')[0];
			
			if(result == "single exceed") {
				swal({   title: "单个文件过大",   type: "error",   confirmButtonText: "OK" });
			}
			else if(result == "all exceed") {
				swal({   title: "总文件过大",   type: "error",   confirmButtonText: "OK" });
			}
			else if(result == "fail") {
				swal({   title: "上传失败",   type: "error",   confirmButtonText: "OK" });
			}
			else {
				//获取文件名
				var addr = window.location.protocol + "//" + window.location.host + "/ExcelForm/fillExcel.jsp" + "?file_name=" +  data.split('&')[1];
				swal({
					  title: "上传成功",
					  text: "填写的地址为：" + addr,
					  type: "success",
					  confirmButtonText: "复制该地址",
					  cancelButtonText : "取消",
					  closeOnConfirm: false,
					  closeOnCancel: true
					},
					function(isConfirm){
						//将网址复制到粘贴板
						window.clipboardData.setData('text', addr);
						swal({   title: "复制成功",   type: "success",   confirmButtonText: "OK" });
					});
			}
		}//ajax请求的success函数
	});//ajax请求
}