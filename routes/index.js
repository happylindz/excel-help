let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({ dest: 'upload/' });
let path = require("path");
let fs = require("fs");
let XlsxHandler = require("../controller.js");

router.get("/", function(req, res) {
	res.render("index");
});

router.post("/upload", upload.single("excel_file"), function(req, res, next){
	console.log(req.file);
	let file = req.file;
	fs.rename(file.path, file.destination + file.originalname, function(err){
		if(err){
			throw err;
		}
		next();
	});
}, function(req, res, next){
	XlsxHandler.saveFile(req.file.destination + req.file.originalname);
	next();
}, function(req, res){
	res.send("Success");
});



module.exports = router;
