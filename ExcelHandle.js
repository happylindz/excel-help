let mongoose = require("mongoose");
let db = mongoose.createConnection("localhost", "excel");

db.on("error", console.error.bind(console, "连接错误:"));

let ExcelSchema = new mongoose.Schema({
	name: String,
	sheet: String,
	cells: [],
})

let ExcelModel = db.model("Excel", ExcelSchema);

let insertSheet = function(data){
	for(let key in data){
		let sheetEntity = new ExcelModel({name: "lindz", sheet: key, cells: data[key]});
		sheetEntity.save();
	}
};

let findSheets = function(username){
	let data = [];
	ExcelModel.find({name: username}, function(err, sheets){
		sheets.forEach( function(sheet) {
			console.log(sheet);
			data.push({
				name: sheet.name, 
				sheet: sheet.sheet,
				cells: sheet.cells
			});
		});
		return data;
	});
}


module.exports = {
	insertSheet: insertSheet,
	findSheets: findSheets
};






