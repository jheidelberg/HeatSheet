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

    db.serialize(function () {
        
        qry = qry.toString().replace('@HEAT', ary["heat"]);
        qry = qry.toString().replace('@TAP', ary["tap"]);
        qry = qry.toString().replace('@PART', ary["part"]);
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

                for (var i = 0; i < rows.length; i++) {
                    var Obj = {
                        'Carbon': rows[i].Carbon
		                , 'Silicon': rows[i].Silicon
		                , 'Chromium': rows[i].Chromium
		                , 'Manganese': rows[i].Manganese
		                , 'Copper': rows[i].Copper
		                , 'Aluminum': rows[i].Aluminum
		                , 'Phosphorus': rows[i].Phosphorus
		                , 'Nickel': rows[i].Nickel
		                , 'Magnesium': rows[i].Magnesium
		                , 'Sulfur': rows[i].Sulfur
		                , 'Moly': rows[i].Moly
		                , 'Tensile': rows[i].Tensile
		                , 'AsBr': rows[i].AsBr
		                , 'Elongation': rows[i].Elongation
		                , 'AHTBri': rows[i].AHTBri
		                , 'Yield': rows[i].Yield
		                , 'cSize': rows[i].cSize
		                , 'dCount': rows[i].dCount
		                , 'Pearlite': rows[i].Pearlite
		                , 'Carbide': rows[i].Carbide
		                , 'Ferrite': rows[i].Ferrite
		                , 'HeatTreat': rows[i].HeatTreat
                        , 'test' : qry
                    };
                    MyJSONObj[i] = Obj;
                }
                response.write(JSON.stringify( MyJSONObj));
                response.end();
            }
        });
    });

} // end rpt function

exports.rpt = rpt