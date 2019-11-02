// script para arrancar la aplicacion
// este coso se ejecuta con node
// con info de https://stackoverflow.com/questions/51201869/node-refused-to-apply-style-because-its-mime-type-text-html-is-not-a-support
// y de https://medium.com/@asfo/desarrollando-una-sencilla-api-rest-con-nodejs-y-express-cab0813f7e4b
// lectura adicional https://stackoverflow.com/questions/5924072/express-js-cant-get-my-static-files-why

var express = require('express');
var app = new express();

app.use('/Static', express.static('Static'));

// abre la conexion con la base de datos
// el nombre de usuario y la contraseña dependen de como configuraste tu maquina
// ver como hacer para que ande en cualquier maquina sin tocar nada
var sql = require("mssql"); // solicita el modulo de sql server
var config = { // establece los parametros para conectarse a la db
    user: 'sa',
    password: 'Intel80386!',
    server: 'localhost', 
    database: 'Simulador' 
};

sql.connect(config, function (err) { // ejecuta la conexion
    if (err) { // si falla al conectarse tira el error
        throw err;
    }
    var request = new sql.Request(); // crea el objeto de la consulta
    request.query('select * from dbo.ParticionesFijas', function (err, resultado) { // ejecuta una consulta de ejemplo
        if (err) { // si hay error en la consulta lo tira en la consola
            console.log(err)
        }
        console.log(resultado.recordset); // tira en la consola el resultado de la consulta
    });
});

app.get('/', function(request, response) {
    response.sendFile('C:/Users/emmah/OneDrive/Facultad/sistemas operativos/repositorio local del tpi/Templates/index.html');
});

app.listen(8000, () => {
    console.log("El servidor está inicializado en el puerto 8000");
});

app.post("/guardarProcesos", function() {
    /*sql.connect(config, function (err) { // ejecuta la conexion
        if (err) { // si falla al conectarse tira el error
            throw err;
        }*/
        var request = new sql.Request(); // crea el objeto de la consulta
        request.query("insert into Simulador.dbo.Procesos (nombre, listado) values ('coso', 'listado');", function (err, resultado) { // ejecuta una consulta de ejemplo
            if (err) { // si hay error en la consulta lo tira en la consola
                console.log(err)
            }
            console.log(resultado); // tira en la consola el resultado de la consulta
        });
    //});
});