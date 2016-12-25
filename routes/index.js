let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({ dest: 'upload/' });
let path = require("path");
let fs = require("fs");
let XlsxHandler = require("../controller.js");
let Excel = require("../ExcelHandle.js");


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
	let message =	XlsxHandler.saveFile(req.body.username, req.file.originalname);
	res.send({
		code: 0,
		message: message
	})
});


router.get("/:user/:id", function(req, res){

	Excel.findSheets(req.params.user, req.params.id, function(data){
		console.log(data);
		if(data != undefined){
			res.render("fill", {excel: data});
		}else{
			res.send("Sheets Not Found!");
		}
	});
	
})



module.exports = router;
