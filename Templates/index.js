// script para arrancar la aplicacion
// este coso se ejecuta con node
// con info de https://stackoverflow.com/questions/51201869/node-refused-to-apply-style-because-its-mime-type-text-html-is-not-a-support
// y de https://medium.com/@asfo/desarrollando-una-sencilla-api-rest-con-nodejs-y-express-cab0813f7e4b
// lectura adicional https://stackoverflow.com/questions/5924072/express-js-cant-get-my-static-files-why

/*este coso no anda
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
});*/

var express = require('express');
var app = new express();

app.use('/Static', express.static('Static'))

app.get('/', function(request, response){
    response.sendFile('C:/Users/emmah/OneDrive/Facultad/sistemas operativos/repositorio local del tpi/Templates/Template2.html');
});

app.listen(8000, () => {
    console.log("El servidor está inicializado en el puerto 8000");
});   