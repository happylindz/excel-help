if($("#excel_input").length > 0){
	$('#excel_input').fileinput({
		language: 'zh',
	  allowedFileExtensions : ['xlsx', 'xls','xlsm', 'xltx', 'xltm', 'xlsb', 'xlam'],   
	  maxFileCount: 1,
	  showUpload: false,
	  previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
	});
}

$(document).ready(function(){

	$(document).on("click", "#upload-file", function() {

		var isEmpty = $("#excel_input").val();
		if(isEmpty != ""){
			var excel_file = new FormData($("#excel_form")[0]);
			excel_file.append("username", "excel");
			new Promise(function(resolve, reject){
				$.ajax({
					cache: false,
					url: '/upload',
					type: 'POST',
					data: excel_file,
					contentType: false,
					processData: false,
					async: true
				})
				.done(function(res) {
					resolve(res);
				})
				.fail(function() {
					console.log("error");
				});

			}).then(function(res){
				if(res.code == 0){
					var address = window.location.protocol + "//" + window.location.host + "/";
					var message = "分享填写的地址为：" + address + res.data.path;
					message += "\n表格下载地址为：" + address + res.data.download;
					message += "\n用户名: " + res.data.username;
					message += "\n密码: " + res.data.password;
					message += "\n为了您的信息安全，请妥善保管你的下载地址，用户名以及密码，以免信息泄露。"
					swal({
					  title: "上传成功",
					  text: message,
					  type: "success",
					  confirmButtonText: "确认",
					  closeOnConfirm: true,
					}, function(){
						$("#excel_input").fileinput("reset");
						$("#excel_input").val("");
					});
				}else if(res.code == 1) {
					swal({
						title: "上传失败",
						text: "请按照模板中对应的格式进行上传",
						type: "error",
						confirmButtonText: "确认"
					})
				}
			});

		}else{
			swal({   
				title: "请先上传文件",   
				type: "error",   
				confirmButtonText: "确认"
			});
		}
		return false;
	});
	$(document).on("click", "#submit-sheets",function(){
		var sheetsData = {};
		var sheets = $("#excel_form").find(".sheet-group");
		sheets.each(function(index, sheet){
			var sheetName = $(sheet).find("h4 > .text-info > span").text();
			sheetsData[sheetName] = {};
			$(sheet).find(".form-group .excel-input").each(function(index, cell){
				sheetsData[sheetName][$(cell).attr("data-type")] = $(cell).val();
			})
		});
		let data = {
			userName: window.location.pathname.split("/")[1],
			sheetKey: window.location.pathname.split("/")[2],
			sheets: sheetsData
		}
		$.ajax({
			url: '/submitdata',
			cache: false,
			type: 'POST',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",     
			async: true		
		})
		.done(function(res) {
			swal({   
				title: "提交成功",   
				type: "success",   
				confirmButtonText: "确认"
			});
			$("input").val("");
		})
		
		return false;
	});
});