let mysql = require('mysql');

class DataHandler {

	constructor() {
		let connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root1995',
		  database : 'excel'
		})
		connection.connect();
		this.connection = connection;
	}

	createAuth() {
		let result = {
			username: "",
			password: ""
		}
		const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		let range = Math.round(Math.random() * 6);
		for(let i = 0; i < range; i++) {
			let pos = Math.round(Math.random() * (arr.length-1));
			result.username += arr[pos];
		}
		let num = Math.floor(Math.random()*10000);
		result.username += num;
		result.password += Math.floor(Math.random()*10000);
		return result;
	}

	checkUser(id) {
		const checkSQL = `select username, password from user where fileid='${id}';`;
		return this.queryPromise(checkSQL).then((data) => {
			let result = {
				code: -1
			}
			if(data.length != 0) {
				result['username'] = data[0].username;
				result['password'] = data[0].password;
				result.code = 0;
			}
			return result;
		})
	}

	queryPromise(sql) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, (err, results) => {
				if(err) {
					reject(err);
				}else {
					resolve(results);
				}
			});
		})
	}

	insertSheet(data) {
		let collections = [];
		let filename = data.filename;
		let fileid = data.fileid;
		let fields = [];
		for(let key in data.sheets) {
			let sql = `insert into excel(filename, fileid, sheetname) values('${filename}', '${fileid}', '${key}');`; 
			collections.push(sql);
			data.sheets[key].forEach((item) => {
				sql = `insert into excelInfo(fileid, sheetname, keyname) values('${fileid}', '${key}', "${item}");`;
				fields.push(item);
				collections.push(sql);
			});
		}
		let sql = `create table excel${fileid}(id int auto_increment primary key`;
		for(let i = 0; i < fields.length; i++) {
			sql += `, ${fields[i]} varchar(45) not null`;
		}
		sql += `)auto_increment=10001;`;
		collections.push(sql);
		let auth = this.createAuth();
		sql = `insert into user(fileid, username, password) values('${fileid}', '${auth.username}', '${auth.password}')`;
		collections.push(sql);
		
		return Promise.all(collections.map((sql) => {
			return this.queryPromise(sql);
		})).then(() => {
			return auth;
		});
	}

	findSheets(data) {

		const fileid = data.id;
		const fileSQL = `select distinct filename from excel where fileid='${fileid}' limit 1;`;
		const keySQL = 	`select distinct sheetname, keyname from excelinfo where fileid='${fileid}'`;
		
		let result = {
			filename: "",
			sheets: {},
			code: -1
		}
		let filePromise = this.queryPromise(fileSQL);
		let keyPromise = this.queryPromise(keySQL);

		return Promise.all([filePromise, keyPromise]).then(([file, keys]) => {
			
			if(file.length == 0) {
				return result;
			}
			result.code = 0;
			result.filename = file[0].filename;
			keys.forEach((key) => {
				if(result.sheets[key.sheetname] == undefined) {
					result.sheets[key.sheetname] = [];
				}
				result.sheets[key.sheetname].push(key.keyname);
			});
			return result;

		}).catch((err) => {
			console.log(err);
			return result;
		});
	}

	insertData(data) {
		let tableName = data.userName + data.sheetKey;
		let keySet = [];
		let resultSet = []
		for(let key in data.sheets) {
			let sheet = data.sheets[key];
			for(let item in sheet) {
				keySet.push(item);
				resultSet.push(sheet[item]);
			}
		}

		resultSet = resultSet.map((item) => {
			return this.connection.escape(item);
		})
		let sql = `insert into ${tableName}(${keySet.join(",")}) values(${resultSet.join(",")})`;	
		return this.queryPromise(sql);
	}

	findXlsx(info) {

		const fileSQL =  `select filename, sheetname from excel where fileid=${info.id};`;
		const sheetSQL = `select sheetname, keyname from excelinfo where fileid=${info.id};`;
		const dataSQL = `select * from excel${info.id};`; 

		let filePromise = this.queryPromise(fileSQL);
		let sheetPromise = this.queryPromise(sheetSQL);
		let dataPromise = this.queryPromise(dataSQL);
		let result = {
			filename: "",
			sheets: {},
			code: -1
		};

		return Promise.all([filePromise, sheetPromise, dataPromise]).then(([file, sheets, data]) => {	
			result.filename = file[0].filename;
			result.code = 0;
			let keyMap = {};
			file.forEach((item) => {
				result.sheets[item.sheetname] = [[]];
			})
			sheets.forEach((sheet) => {
				result.sheets[sheet.sheetname][0].push(sheet.keyname);
				keyMap[sheet.keyname] = sheet.sheetname;
			});
			data.forEach((row) => {
				let res = {};
				for(let key in row) {
					if(key != 'id') {
						let sheetName = keyMap[key];
						let sheet = result.sheets[sheetName];
						if(res[sheetName] == undefined) res[sheetName] = [];

						for(let i = 0; i < sheet[0].length; i++) {
							if(key == sheet[0][i]) {
								res[sheetName][i] = row[key];
								break;
							}
						}
					}
				}
				for(let key in res) {
					result.sheets[key].push(res[key]);
				}
			});
			return result;
		}).catch((err) => {
			console.log(err);
			return result;
		});
	}

}



module.exports = DataHandler;





