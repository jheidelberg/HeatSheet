var sqlite3 = require('/Program Files/nodejs/node_modules/sqlite3/sqlite3'); 
var fs = require("fs");
var querystring = require('querystring');
var utils = require('util');

function DataEnt(request, response, fullBody) {
	// request ended -> do something with the data
	response.writeHead(200, "OK", {'Content-Type': 'text/html'});
					
	// parse the received body data
	var ResponseText = ""; // = querystring.parse(fullBody);
	var qryent = "";
	var insertstmt = "";
	var valstmt = "";
	var ary = new Array();
	ary = querystring.parse(fullBody);
	for (var x in ary) {
		//decodedBody += x + " x: " + ary[x] + "<br>";
		switch (x){
			case "Table" :
				qryent = "insert into " + ary[x] + " ( ";
				break;
			default :
				insertstmt += ", " + x;
				valstmt += ",'" + ary[x] + "'";
				break;
		}
						
	}
					
	qryent += insertstmt.substring(1) + " ) values (" + valstmt.substring(1) + " ) ";

	fs.exists('HeatSheet.sql3', function (exists) {
	    var db = new sqlite3.Database('HeatSheet.sql3');

	    if (!exists) {
	        console.log('Creating database. This may take a while...');
	        fs.readFile('./HeatSheet/CodeBehind/HeatSheetdb.sql', 'utf8', function (err, data) {
	            if (err) {
	                console.log(err);
	                ResponseText = "Problem finding the DB Creation File. " + err;
	                return;
	            }
	            console.log("Read the file..");
	            db.exec(data, function (err) {
	                if (err) {
	                    console.log(err);
	                    ResponseText = "Problem creating the DB. " + err;
	                    return;
	                }
	                console.log('Created the DB.');
	            });
	        });

	    }

	    db.exec(qryent, function (err) {
	        if (err) {
	            ResponseText = "Problem executiong the qry: " + err;
	            response.write(ResponseText);
	            response.end;
	            return;
	        }
	        // response.write("Thank you for entering this info.");


	        // output the decoded data to the HTTP response          

	        ResponseText = fs.readFileSync('./HeatSheet/response.html');
	        ResponseText = ResponseText.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));


	        response.write((ResponseText)); //utils.inspect
	        //response.write('</pre></body></html>');

	        response.end();
	        return;
	    });


	});
					
}

exports.dataent = DataEnt;
