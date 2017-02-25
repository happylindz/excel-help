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
			excel_file.append("phone", $('#phonenumber').val());
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
					var message = "表格分享地址为：" + address + res.share;
					message += "\n下载地址为：" + address + res.download;
					message += "\n用户名及密码已短信发送，请妥善保管你的下载地址，用户名以及密码，以免信息泄露。"
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
				}else{
					swal({
						title: "上传失败",
						text: res.message,
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

	$(document).on("click", "#submit-sheets", function(){
		var sheetsData = {};
		var sheets = $("#excel_form").find(".sheet-group");
		var tag = false;
		sheets.each(function(index, sheet){
			var sheetName = $(sheet).find("h4 > .text-info > span").text();
			sheetsData[sheetName] = {};
			$(sheet).find(".form-group .excel-input").each(function(index, cell){
				var text =  $(cell).val();
				sheetsData[sheetName][$(cell).attr("data-type")] = text;
				if(text != "") {
					tag = true;
				}
			})
		});
		if(!tag) {
			swal({
				title: "提交失败",
				text: "提交信息为空",
				type: "error",
				confirmButtonText: "确认"
			})

			return false;
		}
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
	// $(document).on('click', '#download', function() {
	// 	var $down = $("#download");
	// 	let data = {
	// 		user: $down.attr('data-user'),
	// 		pass: $down.attr('data-pass')
	// 	};
	// 	$.ajax({
	// 		url: '/download/' + $down.attr('data-id'),	
	// 		type: 'POST',
	// 		data: data
	// 	})
	// 	.done(function(res) {
	// 	});		
		
	// })
});