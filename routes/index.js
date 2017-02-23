let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({ dest: 'upload/' });
let path = require("path");
let fs = require("fs");
let XlsxHandler = require("../XlsxHandler.js");
let xlsx = require('node-xlsx');
let basicAuth = require("basic-auth");
let xlsxHandler = new XlsxHandler();

router.get("/", (req, res) => {
	res.render("index");
});

router.post("/upload", upload.single("excel_file"), (req, res, next) => {
	let file = req.file;
	let path = file.destination + file.originalname;
	res.locals.path = path;
	fs.rename(file.path, path, (err) => {
		if(err){
			throw err;
			res.send({
				code: 1,
				message: "服务器发生故障，请稍后重试。"
			})
		}
		next();
	});
}, function(req, res){
	xlsxHandler.saveFile(req.file.originalname).then((data) => {
		console.log(data);
		res.send(data);
		if(data.code == 0) {
			fs.unlink(res.locals.path);
		}
	});
});


router.post("/submitdata", (req, res) => {
	let data = req.body;
	xlsxHandler.insertData(data).then(() => {
		res.send("上传成功");
	});
})

router.get("/download/:id", (req, res, next) => {
	let id = req.params.id;
	function unauthorized(res) { 
    res.set('WWW-Authenticate', 'Basic realm=Input User&Password');
    return res.sendStatus(401);
  }
  let user = basicAuth(res);
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }
  xlsxHandler.checkUser(id).then((data) => {
  	if(data.code != 0) {
  		return unauthorized(res);
  	}
  	if(data.username = user.name && data.password == user.pass) {
  		next();
  	}else {
  		return unauthorized(res);
  	}
  })
});

router.get("/download/:id", (req, res) => {
	let data = {
		id: req.params.id
	}
	xlsxHandler.exportFile(data).then((result) => {
		if(result == false) {
			next();
		}else {
			res.download("./downloads/" + result, (err) => {
				if(err) {
					console.log(err);
				}else {
					fs.unlink("./downloads/" + result);
				}
			})
		}
	});
});

router.get("/excel/:id", (req, res, next) => {
	let data = {
		id: req.params.id
	}
	xlsxHandler.findSheets(data).then((result) => {
		if(result.code == 0) {
			res.render("fill", {excel: result});
		}	else {
			next();
		}
	});	
})

router.get("/template", (req, res) => {
	res.download("./template.png");
});

router.all('*', (req, res) => {
	res.send("您查找的页面未能找到，请重新输入。");
});


module.exports = router;
