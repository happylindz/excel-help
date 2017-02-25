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

 	saveFile(fileName) {
		let workbook = XLSX.readFile(__dirname + "/upload/" + fileName);
		let sheet_name_list = workbook.SheetNames;
		let data = {};
		data['filename'] = fileName;
		data['fileid'] = new Date().getTime();
		data['sheets'] = {};
		for(let i = 0; i < sheet_name_list.length; i++) {
			let sheetname = sheet_name_list[i];
			let worksheet = workbook.Sheets[sheetname];
			if(data["sheets"][sheetname] == undefined){
				data["sheets"][sheetname] = [];
			}
			for(let z in worksheet){
				if(z[0] === '!'){
					continue;
				}
				if(z[1] != 1) {
					return Promise.resolve({
						code: 3, 
						message: "上传文件格式有误"
					});
				}
				data["sheets"][sheetname].push(worksheet[z].v)
			}
		}
		return this.excel.insertSheet(data).then((result) => {
			result["path"] = "excel/" + data["fileid"];
			result['download'] = "download/" + data["fileid"];
			result['code'] = 0;
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
	
	findFile(info) {
		return this.excel.findXlsx(info).then((data) => {
			let result = [];
			let idx = 0;
			for(let key in data.sheets) {
				let sheet = data.sheets[key];
				for(let row = 0; row < sheet.length; row++) {
					if(result[row] == undefined) {
						result[row] = [];
					}
					result[row] = result[row].concat(sheet[row]);
				}
			}
			return {
				filename: data.filename,
				sheets: result
			};
		});
	}

}

module.exports = XlsxHandler;