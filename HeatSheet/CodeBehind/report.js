path = require("path");
var sqlite3 = require('node_modules/sqlite3/sqlite3');
var db = new sqlite3.Database('HeatSheet.sql3');
var fs = require("fs");
var querystring = require('querystring');
var utils = require('util');
var SelStmt = "Select * ";
var FromStmt = "From ";
var WhereStmt = "Where ";


function rpt(request, response, fullBody) {

    
	var ary = new Array();
	ary = querystring.parse(fullBody);
    var ResponseText = ""; 
            
	switch(ary["table"])
	{
	    case "certprint":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/CertQry.sql');
	        qry = qry.toString().replace('@HEAT', Sanitize(ary["heat"]));
	        qry = qry.toString().replace('@PART', Sanitize(ary["part"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "folist":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/folist.sql');
	        qry = qry.toString().replace('@OFFSET', Sanitize(ary["offset"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "fosearch":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/fosearch.sql');
	        qry = qry.toString().replace('@OFFSET', 0); //Sanitize(ary["offset"]));
	        qry = qry.toString().replace('@CUSTOMER', Sanitize(ary["customer"]));
	        qry = qry.toString().replace('@PART', Sanitize(ary["part"]));
	        qry = qry.toString().replace('@PATTERN', Sanitize(ary["pattern"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "getfo":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/getfo.sql');
	        qry = qry.toString().replace('@fonumber', Sanitize(ary["fonumber"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "fos":
	        response.writeHead(200, "OK", {'Content-Type': 'text/html'});
	        if (ary["fo_number"] == 0) {
	            //new fo, add the info
	            var dataent = require("./dataent");
	            dataent.dataent(request, response, fullBody);
	            return;
	        } else {
	            // update exsisting fo.
	            var qry = "";

	            for (var x in ary) {
	                //decodedBody += x + " x: " + ary[x] + "<br>";
	                switch (x) {
	                    case "table":
	                        break;
	                    case "fo_number":
	                        WhereStmt = "Where fo_Number = '" + ary[x] + "'";
	                        break;
	                    default:
	                        qry += ", " + x + " = '" + Sanitize(ary[x]) + "'";
	                        break;
	                }

	            }
	            ResponseText = fs.readFileSync('./HeatSheet/response.html');
	            ResponseText = ResponseText.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));
	            db.all("Update fos set " + qry.substring(1) + WhereStmt, function (err, rows) {
	                if (err) {
	                    ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your entry was <b>NOT</b> acepted.  Please go back and check your entries.  Thank you.');
	                }
	                else {
	                    ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your update was acepted.  Thank you.');
	                }
	                response.write((ResponseText));
	                response.end();
	            });

	        }
	        break;
	    default:
	        response.write('[{"test":"","status":"error","message":"Invalid request:  ' + ary["table"] + '"}]');
	        response.end();
            break;
	}

} // end rpt function

    
    function Sanitize(str){
        if (str) { str = str.replace("'", "''").replace('"','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};

        return str;
    }

    function RunIt(request, response, fullBody, qry) {
        var MyJSONObj = new Array();
        db.serialize(function () {

            db.all(qry, function (err, rows) {
                if (err) {
                    MyJSONObj[0] = { 'test': err, 'status': 'error', 'message': 'Error: ' + err + ' <br> ' + qry };
                    response.write(JSON.stringify(MyJSONObj));
                    response.end();
                    return;
                }
                if (rows) {
                    if (rows.length == 0) {
                        MyJSONObj = [{ 'test': 'none', 'status': 'error', 'message': 'no records found.', 'part': 'Unknown' }];
                        response.write(JSON.stringify(MyJSONObj));
                        response.end();
                    } else {
                        for (var i = 0; i < rows.length; i++) {
                            for (var x in rows[i]) {
                                MyJSONObj[i] = rows[i];
                            }
                        }
                        if (MyJSONObj.length == 0) { MyJSONObj[0] = { 'test': '', 'status': 'error', 'message': 'none', 'part': 'Unknown' }; };
                        response.write(JSON.stringify(MyJSONObj));
                        response.end();
                        return;
                    }
                }
                else {
                    MyJSONObj[0] = { 'test': err, 'status': 'error', 'message': 'no records found.' };
                    response.write(JSON.stringify(MyJSONObj).replace('null', '-'));
                    response.end();
                    return;
                }
            });
        });
    }



exports.rpt = rpt