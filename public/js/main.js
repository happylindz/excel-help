$('#excel_input').fileinput({
	language: 'zh',
  allowedFileExtensions : ['xlsx', 'xls','xlsm', 'xltx', 'xltm', 'xlsb', 'xlam'],   
  maxFileCount: 1,
  showUpload: false,
  previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
});

$(document).ready(function(){

	$(document).on("click", "#upload-file", function(){

		let isEmpty = $("#excel_input").val();
		if(isEmpty != ""){
			let excel_file = new FormData($("#excel_form")[0]);
			excel_file.append("username", "lindz");
			new Promise(function(resolve, reject){
				$.ajax({
					cache: false,
					url: '/upload',
					type: 'POST',
					data: excel_file,
					contentType : false,
					processData:false,
					async: true
				})
				.done(function(res) {
					resolve(res);
				})
				.fail(function() {
					console.log("error");
				});

			}).then(function(res){
				let address = window.location.protocol + "//" + window.location.host;
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
			});

		}else{
			swal({   
				title: "请先上传文件",   
				type: "error",   
				confirmButtonText: "确认"
			});
		}
		return false;
	})

});