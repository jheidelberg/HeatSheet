// NOTE: I amu using the sqlite3 by npm install sqlite3, 
// also this could be installed by doing the following:
// npm install https://github.com/developmentseed/node-sqlite3/tarball/master
// or npm install sqlite3
// all depending on the enviroment installed for/by.
//
//
// See the following page for more info: 
//    https://github.com/developmentseed/node-sqlite3#installing

//"use strict";

var sqlite3 = require('sqlite3'); //.verbose()
var fs = require('fs');
var db;

var mods = require("./mods");

function opendb() {
 fs.exists('database', function (exists) {
  db = new sqlite3.Database('database');
 
  if (!exists) {
    console.info('Creating database. This may take a while...');
    fs.readFile('HeatSheetdb.sql', 'utf8', function (err, data) {
      if (err) throw err;
      db.exec(data, function (err) {
        if (err) throw err;
        console.info('Done.');
      });
    });
  }
});
}


function createTable(tablename) {
    console.log("createTable " + tablename);
    db.run("CREATE TABLE IF NOT EXISTS " + tablename + " (tp varchar(50), clocknumber varchar(50));");
    console.log("Created.");
}

function insertRow(timepunch, clocknumber) {
    var tst = "INSERT INTO TimePunch (tp, clocknumber) VALUES ( '" + timepunch + "' , '" + clocknumber + "'); ";

    //following would be an exelent way to do multiple insert statements at a time so as to keep from
    //  having a major performance hit.  However, running one clock in at a time this is tedious.
    
    //var stmt = db.prepare(tst);
    //    stmt.run();
    //stmt.finalize();
    
    db.run(tst);
}

function readAllRows() {
    db.all("SELECT rowid AS id, tp, clocknumber FROM TimePunch;", function(err, rows) {
        rows.forEach(function (row) {
            console.log(row.id + ": " + row.tp + " - " + row.clocknumber);
        });
    });
}

function closeDb() {
    console.log("closeDb");
    db.close();
}

function runcmd(cmd) {
	if(mods.empty(db)){
		opendb();
	}
	db.run(cmd);
}

exports.opendb = opendb;
exports.closeDb = closeDb;
exports.readAllRows = readAllRows;
exports.insertRow = insertRow;
exports.runcmd = runcmd;