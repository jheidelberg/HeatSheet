var sqlite3 = require('/Program Files/nodejs/node_modules/sqlite3/sqlite3'); 
var fs = require("fs");
var querystring = require('querystring');
var utils = require('util');
var SelStmt = "Select * ";
var FromStmt = "From ";
var WhereStmt = "Where ";
var db = new sqlite3.Database('HeatSheet.sql3');

function rpt(request, response, fullBody) {

    
	var ary = new Array();
	ary = querystring.parse(fullBody);
    var ResponseText = ""; 
	response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
            
	switch(ary["table"])
	{
	    case "certprint":
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/CertQry.sql');
	        qry = qry.toString().replace('@HEAT', Sanitize(ary["heat"]));
	        qry = qry.toString().replace('@PART', Sanitize(ary["part"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "folist":
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/folist.sql');
	        qry = qry.toString().replace('@OFFSET', Sanitize(ary["offset"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "getfo":
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/getfo.sql');
	        qry = qry.toString().replace('@fonumber', Sanitize(ary["fonumber"]));
	        RunIt(request, response, fullBody, qry);
	        break;

	    default:
	        response.write('[{"test":"","status":"error","message":"Invalid request:  ' + ary["table"] + '"}]');
	        response.end();
            break;
	}

} // end rpt function

    
    function Sanitize(str){
        if (str) { str = str.replace("'", "''").replace('"','""'); }else{str='';};
        return str;
    }

    function RunIt(request, response, fullBody, qry) {
        var MyJSONObj = new Array();
        db.serialize(function () {

            db.all(qry, function (err, rows) {
                if (err) {
                    MyJSONObj[0] = { 'test': err, 'status': 'error', 'message': 'Error: ' + err };
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