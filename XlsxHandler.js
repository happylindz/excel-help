let nodeXlsx = require('node-xlsx');
let fsp = require("fs-promise");
let path = require("path");
let XLSX = require("xlsx");
let DataHandler = require("./DataHandler.js");
 
function XlsxHandler(){
	this.excel = new DataHandler();
}
XlsxHandler.prototype.saveFile = function(userName, fileName){
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
	this.excel.insertSheet(data);
	return userName + "/" + data["fileid"];
}

XlsxHandler.prototype.findSheets = function(data, callback) {
	this.excel.findSheets(data, callback);
}

XlsxHandler.prototype.insertData = function(data) {
	this.excel.insertData(data);
}

XlsxHandler.prototype.exportFile = function() {
	
}


module.exports = XlsxHandler;