//rewrote this function to use the server to handle errors.  Hence, took 
// out the following two lines:
//var http = require("http");
//var url = require("url");

var path= require("path");
var fs = require("fs");


var dataent = require("./HeatSheet/CodeBehind/dataent");


//http.createServer(

function Route (request, response) {
	//console.log("Starting: " + request.url + "  ReqMthd:" + request.method);
    
	var filePath = './HeatSheet' + request.url.split("?")[0];
		if (filePath == './HeatSheet/')
			filePath = './HeatSheet/index.html';
			var extname = path.extname(filePath);
		
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'application/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.txt':
				contentType = 'text/plain';
				break;
			case '.png':
				contentType = 'image/png';
				break;
			case '.jpg':
				contentType = 'image/jpeg';
				break;
			case '.svg':
				contentType = 'image/svg+xml';
				break;
			case '.gif':
				contentType = 'image/gif';
				break;
			case '.ico':
				contentType = 'image/ico';
				break;
			case '.xml':
				contentType = 'application/xml';
				break;
			case '.zip':
				contentType = 'application/zip';
				break;
			case '.gzip':
				contentType = 'application/gzip';
				break;
		}
	
		//console.log("[200] " + request.method + " to " + request.url);
		var fullBody = '';
	
		switch (request.method) {
			// if this is a POST response, then we should be reciving data that needs
			// to be parsed and worked with.
		    case 'POST':
		        request.on('data', function (chunk) {
		            fullBody += chunk.toString();
		        });

		        request.on("end", function () {
		            switch (request.url) {
		                case '/DataEnt/FormHandler':
		                    dataent.dataent(request, response, fullBody);
		                    break;
		                case '/Report/FormHandler':
		                    var rpt = require('./HeatSheet/CodeBehind/report');
		                    rpt.rpt(request, response, fullBody);
		                    break;
		                default:
		                    response.writeHead(200, "OK", { 'Content-Type': 'text/html' });
		                    response.write(request.url);
		                    break;

		            }
		        });
		        break;
				
			// If this is a get request, there should be a file we are serving up.
            case 'GET':
                //console.log(request.method + " to " + request.url);
                path.exists(filePath, function (exists) {

                if (exists) {
                    fs.readFile(filePath, function (error, content) {
                        if (error) {
                            response.writeHead(500);
                            console.log("Error: " + filePath);
                            response.end();
                        }
                        else {

                            response.writeHead(200, { 'Content-Type': contentType });
                            content = content.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));
                            response.end(content, 'utf-8');
                        }
                    });
                }
                else {
                    console.log("404 - No Exist: " + request.url);
                    fs.readFile('./HeatSheet/404.html', function (error, content) {
                        if (error) {
                            response.writeHead(500);
                            console.log("Error: " + filePath);
                            response.end();
                        }
                        else {

                            response.writeHead(404, "OK", { 'Content-Type': 'text/html' });
                            content = content.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));
                            response.end(content, 'utf-8');
                        }
                        response.end();
                    });
                }

            });

            break;

        default:
            console.log(request.method + " to " + request.url);
            response.writeHead(500);
            
            response.wirte("Hello?  Anybody out there?");
            response.end();
            break;
			

	        //var lookup = path.basename(decodeURI(request.url)) || '/HeatSheet/index.html',f='content/' + lookup
	

	}
}
//).listen(process.env.PORT);
exports.route= Route;