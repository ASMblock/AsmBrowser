var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var path = require("path");
var root = path.resolve();

function startServer() {
    var server = http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        if (pathname == '/') {
            pathname='/index.html'
        }
        var filepath = path.join(root, pathname);
        fs.stat(filepath, function (err, stats) {
            if (err) {
                response.writeHead(404);
                response.end("404 Not Found.");
            } else {
                response.writeHead(200);
                fs.createReadStream(filepath).pipe(response);
            }
        });
    });
    server.listen(80);
    console.log('Server is running at http://127.0.0.1:80');
}

exports.startServer = startServer;
