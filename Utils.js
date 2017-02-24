let http = require('http');
let url = require('url');
function checkPhone(mobile) {
  let re = /^1[3|5|7|8][0-9]\d{8}$/;  
  if(!re.test(mobile))  
  {  
    return false;  
  }else {
  	return true;
  }  
}

function postInfo(path, headers, body) {
	let urlOptions = url.parse(path);
	let post_options = {
		host: urlOptions.protocol + "//" + urlOptions.host,
		port: '80',
		path: urlOptions.pathname,
		method: 'POST',
		headers: headers
	}
	let post_req = http.request(post_options, (res) => {
		var chunk = "";
		res.on('data', (data) => {
			chunk += data;
		});
		res.on('end', () => {
			console.log(chunk);
		})
	});
	console.log(headers);
	console.log(body);
	post_req.write(JSON.stringify(body));
	post_req.end();
}

module = module.exports = {
	checkPhone: checkPhone,
	postInfo: postInfo
}