let fsp = require("fs-promise");
let path = require("path");
let XLSX = require("xlsx");
let Excel = require("./ExcelHandle.js");

function ExcelHelp(){

}

ExcelHelp.saveFile = function(userName, fileName){
	let workbook = XLSX.readFile(__dirname + "/upload/" + fileName);
	let sheet_name_list = workbook.SheetNames;
	let data = {};
	data['username'] = userName;
	data['filename'] = fileName;
	data['fileid'] = new Date().getTime();
	data['sheets'] = {};
	sheet_name_list.forEach(function(sheetname) {
		let worksheet = workbook.Sheets[sheetname];
		if(data["sheets"][sheetname] == undefined){
			data["sheets"][sheetname] = [];
		}
		for(z in worksheet){
			if(z[0] === '!'){
				continue;
			}
			data["sheets"][sheetname].push(worksheet[z].v)
		}
	});
	Excel.insertSheet(data);
	return userName + "/" + data["fileid"];
}


module.exports = ExcelHelp;