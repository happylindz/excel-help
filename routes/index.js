let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({ dest: 'upload/' });
let path = require("path");
let fs = require("fs");
let XlsxHandler = require("../XlsxHandler.js");
let xlsx = require('node-xlsx');
let xlsxHandler = new XlsxHandler();

router.get("/", function(req, res) {
	res.render("index");
});

router.post("/upload", upload.single("excel_file"), function(req, res, next){
	let file = req.file;
	fs.rename(file.path, file.destination + file.originalname, function(err){
		if(err){
			throw err;
			res.send({
				code: 1,
				message: "服务器发生故障，请稍后重试。"
			})
		}
		next();
	});
}, function(req, res, next){
	let message =	xlsxHandler.saveFile(req.body.username, req.file.originalname);
	res.send({
		code: 0,
		message: message
	})
});

router.post("/submitdata", function(req, res){
	let data = req.body;
	xlsxHandler.insertData(data);
	res.send("上传成功");
})


router.get("/:username/:id/download", function(req, res){

	
	// const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
	// var buffer = xlsx.build([{name: "mySheetName", data: data}]);
	// res.setHeader('Content-Type', 'application/vnd.openxmlformats');
 //  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	// res.end(buffer, 'binary'); 
	res.download("./test.xlsx");
});



router.get("/:username/:id", function(req, res){
	let data = {
		user: req.params.username,
		id: req.params.id
	}
	xlsxHandler.findSheets(data, function(result) {
		if(result.ok == 0) {
			res.render("fill", {excel: result});
		}	else {
			res.send("Sheets Not Found!");
		}
	});	
})



module.exports = router;
