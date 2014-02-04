//added as the path on the server (2003, won't work with iis node) has to have the proper loading for the sqlite3 and that isn't the same as this...
path = require("path");
var sqlite3 = require('node_modules/sqlite3/sqlite3');

var fs = require("fs");
var querystring = require('querystring');
var utils = require('util');

function DataEnt(request, response, fullBody) {
    //Initilize my basic vars that I'm using to create my statments
    //first, what I wish to send back
	var ResponseText = "";
    //what I'm entering
	var qryent = "";
    //insert statment if that is what will happen
	var insertstmt = "";
    //my values for the insert statment
	var valstmt = "";
    //updates have vars and updates together
	var updtstmt = "";
    //the where statment has to be evaluated seperate for the update stmt
	var wherestmt = '';
	var ary = new Array();
	ary = querystring.parse(fullBody);
	for (var x in ary) {
		//decodedBody += x + " x: " + ary[x] + "<br>";
		switch (x){
			case "table" :
                //wwhat table am I inseting this into or updating?
				qryent = "insert into " + ary[x] + " ( ";
				break;
            case "fo_number":
                //fo numbers are not used for datent, they are entered elsewhere.
                break;
            case "rowid":
        /*
            if I have a rowid, that means I'm udating, not adding a new one.
            if it is 0, then I am adding a new row.            
        */
                if (ary[x]!=0){wherestmt = "where rowid = " + Sanitize(ary[x]);}
                break;
            default:
                // all else is what vars I'm adding or updating to the db.
                insertstmt += ", [" + Sanitize(x) + "]";
                valstmt += ",'" + Sanitize(ary[x]) + "'";
                updtstmt += ",[" + Sanitize(x) + "] = '" + Sanitize(ary[x]) + "'";
                break;
		}
						
	}

    //the qury will be left in an indeterminant state, so I need to finish it off.
	qryent += insertstmt.substring(1) + " ) values (" + valstmt.substring(1) + " ) ";
    
        /*
            if the query is an update, then the record ID will not be empty or 0
            hence the where statement will not be blank.            
        */
    
    if(wherestmt!=''){qryent = 'Update ' + ary['table'] + ' set ' + updtstmt.substr(1) + ' ' + wherestmt};
    
        /*
        this should never happen.  If it does, I have a blank db and I'm starting with
        over 15 years of data that I'm importing.  So, this is reall only for the test side.
        */
    fs.exists('HeatSheet.sql3', function (exists)
    {
        var db = new sqlite3.Database('HeatSheet.sql3');

        if (!exists)
        {
            console.log('Creating database. This may take a while...');
            fs.readFile('./HeatSheet/CodeBehind/HeatSheetdb.sql', 'utf8', function (err, data)
            {
                if (err)
                {
                    console.log(err);
                    ResponseText = "Problem finding the DB Creation File. " + err;
                    return;
                }
                console.log("Read the file..");
                db.exec(data, function (err)
                {
                    if (err)
                    {
                        console.log(err);
                        ResponseText = "Problem creating the DB. " + err;
                        return;
                    }
                    console.log('Created the DB.');
                });
            });

        }


        /*
        exec the stmnt and run the function.  Note that the function has to return and all the actual
        running of the code is done in the returning function.  Hence, the response can NOT be After the
        function but has to be In the function or else it will all be out of order and the response will
        thus be empty.
        */

        db.exec(qryent, function (err)
        {
            if (err)
            {
                ResponseText = "Problem executiong the qry: " + err + '    <br>    ' + qryent;
                response.writeHead(200, "OK", { 'Content-Type': 'text/html' });
                response.write(ResponseText);
                response.end();
                return;
            }
            if (ary["table"] == 'fos')
            {
                db.all("select rowid [rowid],  substr((fo_date),3,2) || rowid [fo_number]  from fos order by rowid DESC limit 1", function (err, rows)
                {
                    /*
                    Changed the following to return JSON response instead for quicker data entry.
                    // output the decoded data to the HTTP response          
                    //ResponseText = fs.readFileSync('./HeatSheet/response.html');

                    //Note the included template linkpg.shtml  this will include the dropdown menu
                    //ResponseText = ResponseText.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));

                    */

                    ResponseText = JSON.stringify(rows);

                    response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
                    response.write((ResponseText));
                    response.end();
                    return;
                })
            }
            else
            {
                
                /*
                Changed to respond back using JSON response instead.

                // output the decoded data to the HTTP response          

                ResponseText = fs.readFileSync('./HeatSheet/response.html');

                //Note the included template linkpg.shtml  this will include the dropdown menu
                ResponseText = ResponseText.toString().replace('<!--#include virtual="./linkpg.shtml"-->', fs.readFileSync("./HeatSheet/linkpg.shtml"));

                ResponseText = ResponseText.replace('<!-- Response Hdr -->', '<br>Your entry was accepted.  Thank you.')

                response.writeHead(200, "OK", { 'Content-Type': 'text/html' });
                response.write((ResponseText));
                response.end();
                return;
                */
                
                ResponseText = JSON.stringify(
                    [{
                        'status':'success' ,
                        'message':'The entry was posted'
                        }]);

                response.writeHead(200, "OK", { 'Content-Type': 'application/json' });
                response.write((ResponseText));
                response.end();
                return;

            }
        });


    });
					
}

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
exports.dataent = DataEnt;
