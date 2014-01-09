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

    /*
        find what the table was that is sent back and code acordingly.
        since the table is used, if I need to use the table to actually get
        a query as I added the functionality later I added a secondary SelectTable
        option to actually contain the tablename that I need to run the selet from.
    */
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
            var OpenOnly = ' 1=1 ';
	        if (ary['OpenOnly']) {OpenOnly = " (finish_date is null or finish_date = '') ";}
	        qry = qry.toString().replace('@OpenOnly', OpenOnly);
	        qry = qry.toString().replace('@OFFSET', Sanitize(ary["offset"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "fosearch":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/fosearch.sql');
	        var OpenOnly = ' 1=1 ';
	        if (ary['OpenOnly']) {OpenOnly = " (finish_date is null or finish_date = '') ";}
	        qry = qry.toString().replace('@OpenOnly', OpenOnly);
	        qry = qry.toString().replace('@OFFSET', 0); //Sanitize(ary["offset"]));
	        qry = qry.toString().replace('@CUSTOMER', Sanitize(ary["customer"]));
	        qry = qry.toString().replace('@PART', Sanitize(ary["part"]));
	        qry = qry.toString().replace('@PATTERN', Sanitize(ary["pattern"]));
	        RunIt(request, response, fullBody, qry);
	        break;
        
        /*
            THe product search and get product was my first search functionality that I had added
            and later I added the generic search function.  I can go back and remove the produt
            and take it to a generic instead.
        */
	    case "prodsearch":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/prodqry.sql');
	        qry = qry.toString().replace('@OFFSET', 0); //Sanitize(ary["offset"]));
	        qry = qry.toString().replace('@CUSTOMER', Sanitize(ary["customer"]));
	        qry = qry.toString().replace('@PART', Sanitize(ary["part"]));
	        qry = qry.toString().replace('@HEAT', Sanitize(ary["heat"]));
	        RunIt(request, response, fullBody, qry);
	        break;
	    case "getProduct":
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/getprod.sql');
	        qry = qry.toString().replace('@ROWID', Sanitize(ary["rowid"]));
	        RunIt(request, response, fullBody, qry);
	        break;
        
        /* 
            For the generic search for the products I wil search to see if there is an
            option sent to search for and if so use it and the matching paramiter. Then
            if not I will search for 1=1 and so on.
        */
	    case "GenSearch":
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/GenericQry.sql');
	        qry = qry.toString().replace('@TABLE', Sanitize(ary["Seltable"]));
            if(ary["Opt1"])
            {
	            qry = qry.toString().replace('@OPT1', Sanitize(ary["Opt1"]));
                qry = qry.toString().replace('@PAR1', Sanitize(ary["Par1"]));
            } else
            { 
                qry = qry.toString().replace('@OPT1', 1);
                qry = qry.toString().replace('@PAR1', 1);
            }
            if(ary["Opt2"])
            {
	            qry = qry.toString().replace('@OPT2', Sanitize(ary["Opt2"]));
                qry = qry.toString().replace('@PAR2', Sanitize(ary["Par2"]));
            } else
            { 
                qry = qry.toString().replace('@OPT2', 2);
                qry = qry.toString().replace('@PAR2', 2);
            }
            if(ary["Opt3"])
            {
	            qry = qry.toString().replace('@OPT3', Sanitize(ary["Opt3"]));
                qry = qry.toString().replace('@PAR3', Sanitize(ary["Par3"]));
            } else
            { 
                qry = qry.toString().replace('@OPT3', 3);
                qry = qry.toString().replace('@PAR3', 3);
            }
	        RunIt(request, response, fullBody, qry);
	        break;
        /*
            For the generic delete I check for the table name and the row ID and delete accordingly.
        */
	    case "GenDel":
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/GenericDel.sql');
	        qry = qry.toString().replace('@TABLE', Sanitize(ary["Seltable"]));
	        qry = qry.toString().replace('@ROWID', Sanitize(ary["rowid"]));
	        ResponseText = fs.readFileSync('./HeatSheet/response.html');
	            ResponseText = ResponseText.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));
	            db.all("Update fos set " + qry.substring(1) + WhereStmt, function (err, rows) {
	                if (err) {
	                    ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your entry was <b>NOT</b> deleted.  Please go back and check your entries.  Thank you.');
	                }
	                else {
	                    ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your entry was deleted.  Thank you.');
	                }
	                response.write((ResponseText));
	                response.end();
	            });

	        break;
        /*
          Get the row ID and all info from a table.  
        */
	    case "getGen":
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/GetGeneric.sql');
	        qry = qry.toString().replace('@ROWID', Sanitize(ary["rowid"]));
	        qry = qry.toString().replace('@TABLE', Sanitize(ary["Seltable"]));
	        RunIt(request, response, fullBody, qry);
	        break;
        /*
          Get the FO information from a FO.  Note that the FO Number IS the RowID
          Hence the FO table is unique in the tables in that no other talbes usees
          the rowID
        */
        case "getfo":
        
	        response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
	        var qry = fs.readFileSync('./HeatSheet/CodeBehind/getfo.sql');
            
	        var OpenOnly = ' 1 = 1 ';
	        if (ary['OpenOnly']) {OpenOnly = " (finish_date is null or finish_date = '') ";}
	        qry = qry.toString().replace('@OpenOnly', OpenOnly);
                            
	        qry = qry.toString().replace('@fonumber', Sanitize(ary["fonumber"]));
	        RunIt(request, response, fullBody, qry);
	        break;
        /*
          This is actaly a data entry for the FO, NOT a report request.  However, 
          as this is using the reporting feature of the site and the first update
          of the site, this was how I determenend how to run it.  And as the RowID
          is the FO number, it doesn't quite fit with the rest of the site anyhow.  
        */
	    case "fos":
	        response.writeHead(200, "OK", { 'Content-Type': 'text/html' });
	        if (ary["fo_number"] == 0)
	        {
	            //new fo, add the info
	            var dataent = require("./dataent");
	            dataent.dataent(request, response, fullBody);
	            return;
	        } else
	        {
	            // update exsisting fo.
	            var qry = "";

	            for (var x in ary)
	            {
	                //decodedBody += x + " x: " + ary[x] + "<br>";
	                switch (x)
	                {
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
	            db.all("Update fos set " + qry.substring(1) + WhereStmt, function (err, rows)
	            {
	                if (err)
	                {
	                    ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your entry was <b>NOT</b> acepted.  Please go back and check your entries.  Thank you.');
	                }
	                else
	                {
	                    ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your update was acepted.  Thank you.');
	                }
	                response.write((ResponseText));
	                response.end();
	            });

	        }
	        break;
        /*
          If there is any problems with an invalid POST request, this is the response.  
        */
	    default:
	        response.write('[{"test":"","status":"error","message":"Invalid request:  ' + ary["table"] + '"}]');
	        response.end();
            break;
	}

} // end rpt function

    
        /*
          This sanitise will response back with replacing single quotes with doubleed up
          and then trim multiples down so that I don't have over-runs.  Poormans way.  It'd
          be better to do a regex, I'm afraid I'd get myself into more trouble.  
        */
    function Sanitize(str){
        str = str.replace("'", "''"); 
        //if (str) { str = str.replace("'", "''").replace('"','""'); }else{str='';};
        /*if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        if (str) { str = str.replace("''''", "''").replace('""""','""'); }else{str='';};
        */
        return str;
    }
    
    /*
        This funtion runs the statement and returns back to the client the JSON/AJAX response
        that comes from the db.  This is rather inflexible if you want to have an update or
        insert statement and it comes back with 0 rows though.
    */
    function RunIt(request, response, fullBody, qry) {
        var MyJSONObj = new Array();
        db.serialize(function () {

            db.all(qry, function (err, rows) {
                if (err) {
                    MyJSONObj[0] = { 'test': err, 'status': 'error', 'message': 'Error: ' + err + ' <br> '};
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