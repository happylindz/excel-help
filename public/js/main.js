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

	function uploadFile() {

		var isEmpty = $("#excel_input").val();
		if(isEmpty == ""){
			swal({   
				title: "请先上传文件",   
				type: "error",   
				confirmButtonText: "确认"
			});
			return false;
		}
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
				var shareAddress = address + res.share;
				var downloadAddress = address + res.download;
				var message = `填写地址为：${shareAddress}<br>收表地址为：${downloadAddress}<br>用户名及密码已发送手机，用户名及密码已短信发送，请妥善保管，以免信息泄露。'<div class="social-share" data-sites="weibo,qq,wechat,qzone" data-description="一键分享给朋友" data-wechat-qrcode-title="请打开微信扫一扫"></div>`;
				swal({
				  title: "上传成功",
				  html: message,
				  type: "success",
				  confirmButtonText: "确认",
					allowOutsideClick: false
				}).then(function() {
					$("#excel_input").fileinput("reset");
					$("#excel_input").val("");
				}).catch(function(err) {
					console.log(err);
				})

				let $config = {
			  	url: shareAddress,
			  	title: "Excel 表格助手信息页面",
			  	description: "快来填表格咯！",
			  };
				$('.social-share').share($config);
			}else {
				swal({
					title: "上传失败",
					text: res.message,
					type: "error",
					confirmButtonText: "确认"
				})
			}
		});
	}
	$(document).on("click", "#upload-file", function() {
		var phone = $('#phonenumber').val();
		swal({
		  title: "确认信息",
			text: "请确认你的手机号：" + phone,
		  type: "success",
		  confirmButtonText: "确认",
			showCancelButton: true,
			cancelButtonText: '取消'
		}).then(function() {
			uploadFile();
		}).catch(function() {
			console.log('cancel');
		})
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
});