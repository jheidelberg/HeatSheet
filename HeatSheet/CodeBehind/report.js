var sqlite3 = require('/Program Files/nodejs/node_modules/sqlite3/sqlite3'); 
var fs = require("fs");
var querystring = require('querystring');
var utils = require('util');
var SelStmt = "Select * ";
var FromStmt = "From ";
var WhereStmt = "Where ";

function rpt(request, response, fullBody) {

    
	var ary = new Array();
	ary = querystring.parse(fullBody);
	for (var x in ary) {
		//decodedBody += x + " x: " + ary[x] + "<br>";
		switch (x){
			case "Table" :
				FromStmt = "From " + ary[x] + " ( ";
				break;
            default:
                WhereStmt += x + " = '" + ary[x] + "' and "
                break;

		} // end switch
						
	} //end var x in array

    // request ended -> do something with the data
    //response.writeHead(200, "OK", { 'Content-Type': 'text/html' });
    response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
    var ResponseText = ""; // = querystring.parse(fullBody);
	var db = new sqlite3.Database('HeatSheet.sql3');
	var qry = fs.readFileSync('./HeatSheet/CodeBehind/CertQry.sql');

	//qry = qry.toString().replace('@HEAT', ary["heat"]);
	//qry = qry.toString().replace('@TAP', ary["tap"]);
	//qry = qry.toString().replace('@PART', ary["part"]);

    

    // two ways of running the sql: db.serialize that runs inline and 
    //  will block execution while it is running, or regular and will 
    //  require a callback that runs the following exec.

//Multiple-statement queries are supported; each statement's result set is retuned to the callback as a separate parameter:

//var q = db.query("UPDATE bar SET z=20; SELECT SUM(z) FROM bar;",
//                 function (update, select) {
//                   assert(update.rowsAffected == 1);
//                   assert(select[0]['SUM(z)'] == 20);
//                 });
//
//An array of all result sets is available as the .all property on each result set:
//
//assert(q.all[1].length == 1);
    var MyJSONObj = new Array();
    function Sanitize(str){
        if (str) { str = str.replace("'", "''"); }else{str='';};
        return str;
    }
    db.serialize(function () {

        qry = qry.toString().replace('@HEAT', Sanitize(ary["heat"]));
        qry = qry.toString().replace('@PART', Sanitize(ary["part"]));

        db.all(qry, function (err, rows) {
            if (err) {
                MyJSONObj[0] = { 'test': err, 'status': 'error', 'message': 'Error: ' + err };
                response.write(JSON.stringify(MyJSONObj));
                response.end;
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
                    if (MyJSONObj.length == 0) { MyJSONObj[0] = { 'test': qry, 'status': 'error', 'message': 'none', 'part': 'Unknown' }; };
                    response.write(JSON.stringify(MyJSONObj));
                    response.end();
                    return;
                }
            }
            else {
                MyJSONObj[0] = { 'test': err, 'status': 'error', 'message': 'no records found.' };
                response.write(JSON.stringify(MyJSONObj));
                response.end;
                return;
            }
        });
    });

} // end rpt function

exports.rpt = rpt