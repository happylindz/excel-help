let request = require('request');


function checkPhone(mobile) {
  let re = /^1[3|5|7|8][0-9]\d{8}$/;  
  if(!re.test(mobile))  
  {  
    return false;  
  }else {
  	return true;
  }  
}

// function postInfo(path, headers, body) {
// 	let urlOptions = url.parse(path);
// 	console.log(body);
// 	let post_options = {
// 		host: urlOptions.host,
// 		path: urlOptions.pathname,
// 		method: 'POST',
// 		headers: headers
// 	}
// 	console.log(post_options);
// 	let post_req = http.request(post_options, (res) => {
// 		var chunk = "";
// 		res.on('data', (data) => {
// 			chunk += data;
// 		});
// 		res.on('end', () => {
// 			console.log(chunk);
// 		})
// 	});
// 	post_req.write(querystring.stringify(body));
// 	post_req.end();
// }
// 

function postInfo(path, headers, body) {
	var options = {
		uri: path,
		method: 'POST',
		json: body,
		headers: headers
	}
	request(options, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			console.log(body);
  	}
	})
}


module = module.exports = {
	checkPhone: checkPhone,
	postInfo: postInfo
}