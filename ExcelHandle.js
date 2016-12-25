let mongoose = require("mongoose");
let db = mongoose.createConnection("localhost", "excel");

db.on("error", console.error.bind(console, "连接错误:"));

let ExcelSchema = new mongoose.Schema({
	name: String,
	sheet: String,
	filename: String,
	fileid: Number,
	cells: [],
})

let ExcelModel = db.model("Excel", ExcelSchema);

let insertSheet = function(data){
	for(let key in data.sheets){
		let sheetEntity = new ExcelModel({name: data["username"], filename: data['filename'], fileid: data["fileid"], sheet: key, cells: data.sheets[key]});
		sheetEntity.save();
	}
};

let findSheets = function(username, fileid, callback){
	let data = {};
	data['username'] = username;
	data["fileid"] = fileid;
	data['sheets'] = {}
	new Promise(function(resolve, reject){
		ExcelModel.find({name: username, fileid: fileid}, function(err, sheets){
			if(sheets.length != 0){
				data['filename'] = sheets[0].filename;
			}
			sheets.forEach( function(sheet) {
				data['sheets'][sheet.sheet] = sheet.cells;
			});
			resolve(data);
		});
	}).then(function(data){
		callback(data);
	})
}


module.exports = {
	insertSheet: insertSheet,
	findSheets: findSheets
};






