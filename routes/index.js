let express = require('express');
let router = express.Router();
let multer  = require('multer');
let upload = multer({ dest: 'upload/' });
let path = require("path");
let fs = require("fs");
let XlsxHandler = require("../XlsxHandler.js");
let basicAuth = require("basic-auth");
let Utils = require('../Utils.js');
let config = require('../config/config.js');
let xlsxHandler = new XlsxHandler();

router.get("/", (req, res) => {
	res.render("index", {
		title: "Excel 表格助手"
	});
});

router.post("/upload", upload.single("excel_file"), (req, res, next) => {
	let phone = req.body.phone;
	if(Utils.checkPhone(phone) == true) {
		next();
	}else {
		res.send({
			code: 2,
			message: "手机号输入有误，请重新输入。"
		})
	}
}, (req, res, next) => {
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
}, (req, res) => {
	xlsxHandler.saveFile(req.file.originalname, req.body.phone).then((data) => {
		if(data.code != 0) {
			res.send(data);
		}else {
			let phone = req.body.phone;
			fs.unlink(res.locals.path);
			res.send({
				code: 0,
				share: data.path,
				download: data.download
			});	
			console.log(phone, data.password);
			let content = `密码: ${data.password}，请妥善保管。`;
			let headers = {
				'X-Bmob-Application-Id': config.appID,
				'X-Bmob-REST-API-Key': config.restAPI,
				'Content-Type': 'application/json'
			};
			let body = {
				"mobilePhoneNumber": phone,
				"content": content
			}
			Utils.postInfo('https://api.bmob.cn/1/requestSms', headers, body);
		}
	}).catch((err) => {
		console.log(err);
	})
});


router.post("/submitdata", (req, res) => {
	let data = req.body;
	xlsxHandler.insertData(data).then(() => {
		res.send("上传成功");
	});
})

router.get('/download', (req, res, next) => {
	res.render('login');
});

router.post('/download', (req, res, next) => {
	xlsxHandler.checkUser(req.body).then(result => {
		if(result.code == 0) {
			req.session.fileid = result.fileid;
			req.session.checked = true;
			res.redirect('/download/preview');
		}else {
			res.render('fail.ejs');
		}
	}); 
});

router.get('/download/preview', (req, res, next) => {
	if(req.session.checked && req.session.fileid) {
		let data = {
			id: req.session.fileid
		};
		return xlsxHandler.findFile(data).then((result) => {
			if(result == false) {
				next();
			}
			res.render("download.ejs", {
				title: "Excel 表格助手下载页面",
				excel: result,
				id: data.id,
				filled: result.num
			})
		})
	}else {
		next();
	}
});

// router.get("/download/:id", (req, res, next) => {
// 	let id = req.params.id;
// 	function unauthorized(res) { 
//     res.set('WWW-Authenticate', 'Basic realm=Input User&Password');
//     return res.sendStatus(401);
//   }
//   let user = basicAuth(res);
//   if (!user || !user.name || !user.pass) {
//     return unauthorized(res);
//   }
//   xlsxHandler.checkUser(id).then((data) => {
//   	if(data.code != 0) {
//   		return unauthorized(res);
//   	}
//   	if(data.username = user.name && data.password == user.pass) {
//   		res.locals.username = user.name;
//   		res.locals.password = user.pass;
//   		next();
//   	}else {
//   		return unauthorized(res);
//   	}
//   })
// });


router.get("/downloads/:id", (req, res, next) => {
	if(req.session.checked && req.session.fileid) {
		let data = {
			id: req.session.fileid
		}
		xlsxHandler.exportFile(data).then((result) => {
			if(result == false) {
				next();
			}else {
				res.download("./downloads/" + result, (err) => {
					if(err) {
						console.log(err);
						next();
					}else {
						fs.unlink("./downloads/" + result);
					}
				})
			}
		});
	}else {
		next();
	}
})


router.get("/excel/:id", (req, res, next) => {
	let data = {
		id: req.params.id
	}
	xlsxHandler.findSheets(data).then((result) => {
		if(result.code == 0) {
			res.render("fill", {
				excel: result,
				title: "Excel 表格助手信息页面"
			});
		}	else {
			next();
		}
	});	
})

// router.get('/clear', (req, res, next) => {
// 	if(req.session.checked && req.session.fileid) {
// 		let data = {
// 			id: req.session.fileid
// 		}
// 		xlsxHandler.clearFile(data).then((result) => {
// 			if(result == false) {
// 				next();
// 			}else {
// 				res.download("./downloads/" + result, (err) => {
// 					if(err) {
// 						console.log(err);
// 						next();
// 					}else {
// 						fs.unlink("./downloads/" + result);
// 					}
// 				})
// 			}
// 		});
// 	}else {
// 		next();
// 	}
// });

router.get("/template", (req, res) => {
	res.download("./template.xlsx");
});

router.all('*', (req, res) => {
	res.render('404.ejs');
});

module.exports = router;
