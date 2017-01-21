let mysql = require('mysql');
function DataHandler() {
	let connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	  database : 'excel'
	});
	connection.connect();
	this.connection = connection;
}

DataHandler.prototype.query = function(sql) {
	this.connection.query(sql, function(error) {
		if(error) {
			throw error;
		}
	})
}


DataHandler.prototype.insertSheet = function(data) {
	let username = data.username;
	let filename = data.filename;
	let fileid = data.fileid;
	let fields = [];
	for(let key in data.sheets) {
		let sql = `insert into excel(username, filename, fileid, sheetname) values('${username}', '${filename}', '${fileid}', '${key}')`;  
		this.query(sql);
		data.sheets[key].forEach(function(item) {
			sql = `insert into excelInfo(fileid, sheetname, keyname) values('${fileid}', '${key}', "${item}")`;
			this.query(sql);
			fields.push(item);
		}.bind(this));
	}
	let sql = `create table ${username}${fileid}(id int auto_increment primary key`;
	for(let i = 0; i < fields.length; i++) {
		sql += `, ${fields[i]} varchar(20) not null`;

	}
	sql += `)auto_increment=10001;`;
	this.query(sql);
}

DataHandler.prototype.findSheets = function(data, callback) {
	let res = {
		filename: "",
		sheets: {},
		ok: -1
	}
	let username = data.user;
	let fileid = data.id;
	let filename;
	let sql = `select distinct filename from excel where username='${username}' and fileid='${fileid}' limit 1;`;
	console.log(sql);
	this.connection.query(sql, function(error, results) {
		if(error) {
			throw error;
		}else {
			console.log(results);
			if(results.length != 0) {
				res.ok = 0;
				res.filename = results[0].filename;
				let sql = `select distinct sheetname, keyname from excelinfo where fileid='${fileid}'`;
				this.connection.query(sql, function(error, results) {
					if(error) {
						throw error;
					}else {
						results.forEach(function(result) {
							if(res.sheets[result.sheetname] == undefined) {
								res.sheets[result.sheetname] = [];
							}
							res.sheets[result.sheetname].push(result.keyname);
						});
						console.log("find the sheet.");
						callback(res);
					}
				}.bind(this));
			}else {
				res.ok = 1;
				callback(res);
			}
		}
	}.bind(this));

}

DataHandler.prototype.insertData = function(data) {
	let tableName = data.userName + data.sheetKey;
	let keySet = [];
	let resultSet = []
	for(let key in data.sheets) {
		let sheet = data.sheets[key];
		for(let item in sheet) {
			keySet.push(item);
			resultSet.push("'" + sheet[item] + "'");
		}
	}
	let sql = `insert into ${tableName}(${keySet.join(",")}) values(${resultSet.join(",")})`;
	this.query(sql);
}

// connection.query('SELECT * FROM USER', function (error, results, fields) {
//   if (error) throw error;

//   console.log(results[0].id);
//   console.log(results[1].id);
// });

// connection.end();



module.exports = DataHandler;





