var static = require('node-static');

var file = new static.Server('./public');

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		file.serve(request, response);
	}).resume();
}).listen(8084);

console.log("Ir a http://127.0.0.1:8084");