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
				var message = `填写地址：${shareAddress}<br>密码已短信发送，请妥善保管，以免信息泄露。'<div class="social-share" data-sites="weibo,qq,wechat,qzone" data-description="一键分享给朋友" data-wechat-qrcode-title="扫一扫，将表格分享给别人"></div>`;
				swal({
				  title: "上传成功",
				  html: message,
				  type: "success",
				  confirmButtonText: "下一步",
					allowOutsideClick: false
				}).then(function() {
					var message = `收表地址：${downloadAddress}<br>通过上述网址获取填表结果。'<div class="social-share" data-sites="qq,wechat" data-description="请把收表地址收藏到你的微信上" data-wechat-qrcode-title="扫一扫, 收藏填表地址"></div>`;
					swal({
						title: '确认收表地址',
						html: message,
						type: 'success',
						confirmButtonText: "确认",
						allowOutsideClick: false
					}).then(function() {
						$("#excel_input").fileinput("reset");
						$("#excel_input").val("");
					}).catch(function(err) {
						console.log(err);
					});
					var $config = {
				  	url: downloadAddress,
				  	title: "IForm 我收表",
				  	description: "请收藏你的收表地址！",
				  };
					$('.social-share').share($config);

				}).catch(function(err) {
					console.log(err);
				})

				var $config = {
			  	url: shareAddress,
			  	title: "IForm 我收表",
			  	description: "这里有份表格需要你填写！",
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