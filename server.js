// NOTE the change from the server-linux.js file in that IIS will handle problems and mulitple calls for the different clients
// and wil recycle the process workers including for updates and changes.  So I am going to go with this as I will probably 
// host this on a windows box.  If not, I have the server-linux.js file that I can use instead.  
// Now I can program this on the windows system I have and not loose files as I did with cloud9....

var http = require('http');
var router = require("./router");

http.createServer(function (req, res) {
    
      router.route (req,res);
}).listen(process.env.PORT);  