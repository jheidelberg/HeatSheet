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
    response.writeHead(200, "OK", { 'Content-Type': 'text/html' });
    var ResponseText = ""; // = querystring.parse(fullBody);
	var db = new sqlite3.Database('HeatSheet.sql3');
	var qry = fs.readFileSync('./HeatSheet/CodeBehind/CertQry.sql');
    qry = qry.toString().replace('%HEAT%',ary["heat"]);
    qry = qry.toString().replace('%TAP%',ary["tap"]);

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


    db.serialize(function () {
        db.all(qry, function (err, rows) {
            if (err) {
                response.write("Error: " + err);
                response.end;
                return;
            }
            if (rows.length < 0) {
                response.write("Error.  Nothin comming.");
                response.end;
            } else {
                for (var i = 0; i < rows.length; i++ ) {
                    ResponseText += "<br>Item #: " + i + '<br>'
					+ '<br>Carbon :'  + rows[i].carbon
                    + '<br>Silicon :'  + rows[i].silicon
                    + '<br>Chromium :'  + rows[i].chromium
                    + '<br>Manganese :'  + rows[i].manganese
                    + '<br>copper :'  + rows[i].copper
                    + '<br>aluminum :'  + rows[i].aluminum
                    + '<br>phosphorus :'  + rows[i].phosphorus
                    + '<br>nickel :'  + rows[i].nickel
                    + '<br>magnesium :'  + rows[i].magnesium
                    + '<br>sulfur :'  + rows[i].sulfur
                    + '<br>moly :'  + rows[i].moly
                    + '<br>Tensile :'  + rows[i].tensile
                    + '<br>ac_bhn :'  + rows[i].asbr
                    + '<br>elong :'  + rows[i].elong
                    + '<br>aht_bhn :'  + rows[i].ahtbri
                    + '<br>yield     :'  + rows[i].yield    
                    + '<br>c_Size :'  + rows[i].c_size
                    + '<br>d_Count :'  + rows[i].d_count
                    + '<br>Pearlite    :'  + rows[i].pearlite    
                    + '<br>Carbide     :'  + rows[i].carbide    
                    + '<br>Ferrite     :'  + rows[i].ferrite    
                    + '<br>HtMethod :'  + rows[i].htmethod
;
                }

                    response.write("I'm finished here...<br>" + ResponseText);
                response.end();
            }
        });
    });

} // end rpt function

exports.rpt = rpt