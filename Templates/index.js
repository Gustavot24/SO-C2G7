// script para arrancar la aplicacion
// este coso se ejecuta con node
// con info de https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js

var http = require('http');
var fs = require('fs');

fs.readFile('./Template2.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHead(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});