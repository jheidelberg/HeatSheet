
/*****************************************************************\
Notes:
\*****************************************************************/


http://python.org/download/
http://www.microsoft.com/visualstudio/eng/products/visual-studio-express-products
npm install sqlite3 -g

Also, some Node & SQLite3 install probs solved by:
www.bitbonsai.com/nodejs-npm-and-sqlite3/


Update (12-10-2013) from installing on FP01:

Notes on getting things running on FP01:

    I installed Microsoft Visual C++ Express 2010, Python 3.3, Python 3.3 Extentions, GetGnewWin32, Node.js and Sqlite3.
    FP01 is a Microsoft Windows 2003 Server.
    I tried to download and install the VS c++ from the web site and install that way, but it didn't work.  Downloaded 
    and created  CD and it worked that way.
    
    Although I'd prefer to run this via IISNode, IISNode requires Server 2008 or better.  My servers are all 2003 at this
    time.  Hence, to run this on the servers the MS utility ServeAny.exe can be used to run this.


/*****************************************************************\

Exert from http://delog.wordpress.com/2012/10/26/node-js-and-sqlite3/
  about installing SQLite3

\*****************************************************************/


Dev @ Work
take care
Node.js and Sqlite3
leave a comment »

      2 Votes

Node.js and Sqlite3 can be used as a foundation for apps that are cross-platform, browser-based (leverage HTML5), and network-intensive. In this post I comment about some of the work required in building such a foundation.

Install sqlite3 for Node.js on Windows

The installation procedure for the sqlite3 module is slightly complex and requires that you have installed the python interpreter and the VC++ compiler. Then just head over to the command prompt and run:

npm install sqlite3 --arch=ia32
You can add the -g option after npm if you want to install to the global node_modules folder. The arch option is required for the module to work on Windows 7 64-bit. Without it you’ll get a cryptic message like:

Error: %1 is not a valid Win32 application
Hopefully, at some point pre-compiled binaries will be provided for Windows.

Opening or creating a database


/*****************************************************************\
I like to maintain a database creation script. The code below is a 
simple example of how I detect and execute the creation script.
\*****************************************************************/

var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
 
fs.exists('database', function (exists) {
  db = new sqlite3.Database('database');
 
  if (!exists) {
    console.info('Creating database. This may take a while...');
    fs.readFile('create.sql', 'utf8', function (err, data) {
      if (err) throw err;
      db.exec(data, function (err) {
        if (err) throw err;
        console.info('Done.');
      });
    });
  }
});

/*****************************************************************\
Here’s how create.sql may look like:
\*****************************************************************/
CREATE TABLE customer (
  id INT NOT NULL,
  CONSTRAINT PK_customer PRIMARY KEY (id ASC)
);
 
CREATE TABLE sale (
  id INT NOT NULL,
  CONSTRAINT PK_sale PRIMARY KEY (id ASC)
);


/*****************************************************************\
Embedding Node.js
\*****************************************************************/

It is rather convenient if you can package Node.js and its modules in a single installer. I discussed this in a post about the Wix Toolset recently. I use npm without the -g option to download and install all modules in a node_modules folder. I place the single executable version of Node.js in the same folder. The installer just needs to package that folder, and you have a platform-specific package of Node.js and your application’s module dependencies ready to install.
