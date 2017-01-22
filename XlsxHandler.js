let fsp = require("fs-promise");
let path = require("path");
let XLSX = require("xlsx");
let DataHandler = require("./DataHandler.js");
 
 class XlsxHandler {

 	constructor() {
 		this.excel = new DataHandler();
 	}

 	checkUser(id) {
 		return this.excel.checkUser(id);
 	}

 	saveFile(userName, fileName){
		let workbook = XLSX.readFile(__dirname + "/upload/" + fileName);
		let sheet_name_list = workbook.SheetNames;
		let data = {};
		data['username'] = userName;
		data['filename'] = fileName;
		data['fileid'] = new Date().getTime();
		data['sheets'] = {};
		sheet_name_list.forEach((sheetname) => {
			let worksheet = workbook.Sheets[sheetname];
			if(data["sheets"][sheetname] == undefined){
				data["sheets"][sheetname] = [];
			}
			for(let z in worksheet){
				if(z[0] === '!'){
					continue;
				}
				data["sheets"][sheetname].push(worksheet[z].v)
			}
		});
		return this.excel.insertSheet(data).then((result) => {
			result["path"] = userName + "/" + data["fileid"];
			result['download'] = "download/" + data["fileid"];
			return result;
		});
	}

	findSheets(data) {
		return this.excel.findSheets(data);
	}

	insertData(data) {
		return this.excel.insertData(data);
	}

	createCell(ws, data, row, col) {
		let cell = {
			v: data
		}
		if(cell.v == null) {
			return;
		}
		let cell_ref = XLSX.utils.encode_cell({r: row, c: col});
		if(typeof cell.v === 'number') {
			cell.t = 'n';
		}else if(typeof cell.v === 'boolean') {
			cell.t = 'b';
		}else {
			cell.t = 's';
		}
		ws[cell_ref] = cell;
	}

	exportFile(info) {

		let wb = {}
		wb.Sheets = {};
		wb.Props = {};
		wb.SSF = {};
		wb.SheetNames = [];

		return this.excel.findXlsx(info).then((data) => {
			if(data.code == 1) return false; 
			for(let key in data.sheets) {
				let ws = {};
				let range = {s: {c:0, r:0}, e: {c:0, r:0 }};
				let sheet = data.sheets[key];
				for(let row = 0; row < sheet.length; row++) {
					if(range.e.r < row) range.e.r = row;
					for(let col = 0; col < sheet[row].length; col++) {
						if(range.e.c < col) range.e.c = col; 
						this.createCell(ws, sheet[row][col], row, col);
					}
				}
				ws['!ref'] = XLSX.utils.encode_range(range);
				wb.SheetNames.push(key);
				wb.Sheets[key] = ws;
			}
			XLSX.writeFile(wb, "./downloads/" + data.filename);
			return data.filename;
		});
	}


}

module.exports = XlsxHandler;