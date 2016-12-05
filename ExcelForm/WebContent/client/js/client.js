function submitExcel() {
	//将填写的表单序列化
	var submitData = $('#excel_form').serialize();
	
	console.log(submitData);
	
	//进行用户注册信息的上传
	$.ajax({
		cache: false,
		type: "POST",
		url:"servlet/ModifyExcelServlet",
		data:submitData,// 你的formid
		dataType:"text",	//返回纯字符串类型
		async: true,
		error: function(request) {
			swal({   title: "填写失败",   type: "error",   confirmButtonText: "OK" });
		},
		success: function(data) {
			swal({   title: "填写成功",   type: "success",   confirmButtonText: "OK" });
		}//ajax请求的success函数
	});//ajax请求
}