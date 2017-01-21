let mysql = require('node-mysql-promise');
function DataHandler() {
	let connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	  database : 'excel'
	});
	this.connection = connection;
}

//SELECT * FROM table; 
// mysql.table('table').select().then(function (data) {
//     console.log(data);
// }).catch(function (e) {
//     console.log(e);
// });


DataHandler.prototype.query = function(sql) {
	this.connection.query(sql, function(error) {
		if(error) {
			throw error;
		}
	})
}


DataHandler.prototype.insertSheet = function(data) {
	console.log(data);
	let insertExcelData = [];
	let insertExcelInfoData = [];
	let username = data.username;
	let filename = data.filename;
	let fileid = data.fileid;

	for(let key in data.sheets) {
		insertExcelData.push({
			username: username,
			filename: filename,
			fileid: fileid,
			sheetname: key
		})
		data.sheets[key].forEach(function(item) {
			insertExcelInfoData.push({
				fileid: fileid,
				sheetname: key,
				keyname: item
			})
		});
	}
	this.connection.table("excel").addAll(insertExcelData).then(function() {
		console.log("insert excel successfully.");
	}).catch(function() {
		console.log("faild to insert excel.");
	}).table("excelInfo").addAll(insertExcelInfoData).then(function() {
		console.log("insert excel info successfully.");
	}).catch(function() {
		console.log("fail to insert excel info.");
	})

	// for(let key in data.sheets) {
	// 	let sql = `insert into excel(username, filename, fileid, sheetname) values('${username}', '${filename}', '${fileid}', '${key}')`;  
	// 	console.log(sql);
	// 	this.query(sql);
	// 	data.sheets[key].forEach(function(item) {
	// 		sql = `insert into excelInfo(fileid, sheetname, keyname) values('${fileid}', '${key}', "${item}")`;
	// 		this.query(sql);
	// 	}.bind(this))
	// }
}

DataHandler.prototype.findSheets = function(data) {
	let username = data.user;
	let fileid = data.id;
	let filename;
	let sql = `select filename from excel where username='${username}' and fileid='${fileid}'`;
	this.connection.query(sql, function(error, results) {
		if(error) {
			throw error;
		}else {
			filename = results.filename;
		}
	})

}

// connection.query('SELECT * FROM USER', function (error, results, fields) {
//   if (error) throw error;

//   console.log(results[0].id);
//   console.log(results[1].id);
// });

// connection.end();



module.exports = DataHandler;





