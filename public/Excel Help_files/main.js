$(document).ready(function(){
	$('#excel_input').fileinput({
		language: 'zh',
	  allowedFileExtensions : ['xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam'],   
	  maxFileCount: 1,
	  showUpload: false,
	  previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
	});
	$(document).on("click", "#upload-file", function(){

		let isEmpty = $("#excel_input").val();
		if(isEmpty != ""){
			let excel_file = new FormData(excel_form);
		}else{
			swal({   title: "请先上传文件",   type: "error",   confirmButtonText: "确认" });
		}
		return false;
	})

});