//added as the path on the server (2003, won't work with iis node) has to have the proper loading for the sqlite3 and that isn't the same as this...
path = require("path");
var sqlite3 = require('node_modules/sqlite3/sqlite3');

var fs = require("fs");
var querystring = require('querystring');
var utils = require('util');

function DataEnt(request, response, fullBody) {
	var ResponseText = "";
	var qryent = "";
	var insertstmt = "";
	var valstmt = "";
	var updtstmt = "";
	var wherestmt = '';
	var ary = new Array();
	ary = querystring.parse(fullBody);
	for (var x in ary) {
		//decodedBody += x + " x: " + ary[x] + "<br>";
		switch (x){
			case "Table" :
				qryent = "insert into " + ary[x] + " ( ";
				break;
			case "table" :
				qryent = "insert into " + ary[x] + " ( ";
				break;
            case "fo_number":
                break;
            case "rowid":
                if (ary[x]!=0){wherestmt = "where rowid = " + ary[x];}                
                break;
            default:
                insertstmt += ", [" + x + "]";
                valstmt += ",'" + ary[x] + "'";
                updtstmt += ",[" + x + "] = '" + ary[x] + "'";
                break;
		}
						
	}

	qryent += insertstmt.substring(1) + " ) values (" + valstmt.substring(1) + " ) ";
    
    //if the query is an update, then the record ID will not be empty or 0
    //hence the where statement will not be blank.
    
    if(wherestmt!=''){qryent = 'Update ' + ary['table'] + ' set ' + updtstmt.substr(1) + ' ' + wherestmt};

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
	            ResponseText = "Problem executiong the qry: " + err + '    <br>    ' + qryent;
	            response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	            response.write(ResponseText);
	            response.end();
	            return;
	        }
	        // response.write("Thank you for entering this info.");


	        // output the decoded data to the HTTP response          

	        ResponseText = fs.readFileSync('./HeatSheet/response.html');
	        ResponseText = ResponseText.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));

            ResponseText = ResponseText.replace('<!-- Response Hdr -->','<br>Your entry was acepted.  Thank you.')
	        
	        response.writeHead(200, "OK", {'Content-Type': 'text/html'});
            response.write((ResponseText));
	        response.end();
	        return;
	    });


	});
					
}

exports.dataent = DataEnt;
