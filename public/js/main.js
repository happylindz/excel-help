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

	$(document).on("click", "#upload-file", function(){

		var isEmpty = $("#excel_input").val();
		if(isEmpty != ""){
			var excel_file = new FormData($("#excel_form")[0]);
			excel_file.append("username", "lindz");
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
					var address = window.location.protocol + "//" + window.location.host + "/" + res.message;
					swal({
					  title: "上传成功",
					  text: "分享填写的地址为：" + address,
					  type: "success",
					  confirmButtonText: "确认",
					  closeOnConfirm: true,
					}, function(){
						$("#excel_input").fileinput("reset");
						$("#excel_input").val("");
					});
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
		// console.log(sheets);
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
			console.log(111);
			swal({   
				title: "提交成功",   
				type: "success",   
				confirmButtonText: "确认"
			});
		})
		
		return false;
	});
});