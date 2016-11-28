let fsp = require("fs-promise");
let path = require("path");
let XLSX = require("xlsx");

function ExcelHelp(){

}

ExcelHelp.saveFile = function(filePath){
	let workbook = XLSX.readFile(filePath);
	let sheet_name_list = workbook.SheetNames;
	let data = {};
	sheet_name_list.forEach( function(sheetname) {
		let worksheet = workbook.Sheets[sheetname];
		if(data[sheetname] == undefined){
			data[sheetname] = [];
		}
		for(z in worksheet){
			if(z[0] === '!'){
				continue;
			}
			data[sheetname].push(worksheet[z].v)
		}
	});
}


module.exports = ExcelHelp;