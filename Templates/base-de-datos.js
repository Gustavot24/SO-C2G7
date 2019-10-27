// Script para conectarse a la base de datos
// con info de https://medium.com/zero-equals-false/how-to-connect-node-js-app-with-sql-server-18a176afae46 (casi todo)
// y de https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs (algunas cosas)

// primero tenes que seguir todos los pasos del primer link (menos el que tiene el codigo js)
// despues tenes que estar en la carpeta Templates
// despues ejecutar npm init -y (no creo que sea necesario, ya hice y subi al git)
// y despues npm install mssql (idem)
// y despues ejecutar el script con node base-de-datos.js

// FALTA HACER:
// QUE DE ALGUN MODO SE CREE LA DB Y LAS TABLAS ANTES DE ARRANCAR EL PROGRAMA

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

// cierra la conexion con la base de datos
// se ejecuta al cerrar la pagina o al recargar
// con info de https://stackoverflow.com/questions/13443503/run-javascript-code-on-window-close-or-page-refresh
//window.addEventListener("beforeunload", function(e){
//    
//}, false); 

// guarda la lista de particiones que esta en el html en la db
function guardarParticiones(nombre) {
    var tablaConvertidaEnString = JSON.stringify(condicionesIniciales.tablaParticiones); // convierte el array de particiones en un string de un jota son
    var tamanoMemoria = document.getElementById("mp").value; // obtiene el tamaño de la memoria
    var porcentajeSO = document.getElementById("myRange").value; // obtiene el porcentaje ocupado por el SO
    var algoritmo; //declara una variable para guardar el algoritmo
    if (document.getElementById("frtfit").checked == true) { // depende del radiobutton chequeado asigna el algoritmo
        algoritmo = "firstfit";
    }
    else {
        algoritmo = "bestfit";
    }
    var stringDeConsulta = "INSERT INTO ParticionesFijas (nombre, tamanoMemoria, porcentajeSO, algoritmo, listado) VALUES " +
        "'" + nombre + "', " +
        tamanoMemoria + ", " + porcentajeSO + ", '" + algoritmo + "', " +
        "'" + tablaConvertidaEnString + "';"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    alert(stringDeConsulta);
    sql.connect(config, function (err) { // ejecuta la conexion
        if (err) { // si falla al conectarse tira el error en un alert
            alert(err);
        }
        var request = new sql.Request(); // crea el objeto de la consulta
        request.query(stringDeConsulta, function (err, resultado) { // ejecuta una consulta de ejemplo
            if (err) { // si hay error en la consulta lo tira como un alert
                alert(err);
            }
            // aca tiene que ir un mensaje que diga que se guardo exitosamente
        });
    });    
}

// recupera una lista de particiones de la db y la carga en la tabla del html
// con info de https://stackoverflow.com/questions/10911526/how-do-i-change-an-html-selected-option-using-javascript
// y de https://www.w3schools.com/jsref/prop_range_value.asp
function cargarParticiones(nombre) {
    var tabla = document.getElementById("tabla-particiones"); // variable que apunta a la tabla de particiones
    var stringDeConsulta = 'SELECT * FROM ParticionesFijas WHERE nombre = "' + nombre + '";'; // crea el string de la consulta
//    rs.open(stringDeConsulta, conexion); // ejecuta la consulta
//    rs.moveFirst; // se mueve al primer registro de la consulta
    // [0] es el id, [1] es el nombre, despues van los demas campos
    switch (rs.fields[2]) { // asigna el valor del tamaño de memoria al select
        case "128":
            document.getElementById("mp").value = "128";
            break;
        case "256":
            document.getElementById("mp").value = "256";
            break;
        case "512":
            document.getElementById("mp").value = "512";
            break;
        case "1024":
            document.getElementById("mp").value = "1024";
            break;
        case "2048":
            document.getElementById("mp").value = "2048";
            break;
    }
    document.getElementById("myRange").value = rs.fields[3]; // asigna el valor del porcentaje del SO al range
    if (rs.fields[4] = "firstfit") {
        document.getElementById("frtfit").checked = true;
    }
    else {
        document.getElementById("bstfit").checked = true;
    }
    var tablaConvertidaEnJSON = JSON.parse(rs.fields(5)); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
    for (var i = 0; i < tablaConvertidaEnJSON.length; i++) { // itera  sobre el array de objects
        var nuevaFila = tabla.insertRow(); //agrega una nueva fila a la tabla de particiones
        var celdaIdParticion = nuevaFila.insertCell(0); // le va agregando las celdas a la fila esa
        var celdaDirInicio = nuevaFila.insertCell(1);
        var celdaDirFin = nuevaFila.insertCell(2);
        var celdaTamano = nuevaFila.insertCell(3);
        celdaIdParticion.innerHTML = tablaConvertidaEnJSON[i].idParticion; // le va cargando los datos a cada una de las celdas
        celdaDirInicio.innerHTML = tablaConvertidaEnJSON[i].dirInicio;
        celdaDirFin.innerHTML = tablaConvertidaEnJSON[i].dirFin;
        celdaTamano.innerHTML = tablaConvertidaEnJSON[i].tamano;
    }
}

// guarda la lista de procesos que esta en el html en la db
// con info de https://stackoverflow.com/questions/13137597/how-to-get-element-inside-a-td-using-row-index-and-td-index
function guardarProcesos(nombre) {
    var tablaConvertidaEnJSON = JSON.stringify(tablaProcesos); // convierte el listado de procesos en un string de un jota son
    var stringDeConsulta = "INSERT INTO Procesos (nombre, listado) VALUES " +
        "'" + nombre + "', " +
        "'" + tablaConvertidaEnJSON + "'"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    alert(stringDeConsulta);
    sql.connect(config, function (err) { // ejecuta la conexion
        if (err) { // si falla al conectarse tira el error en un alert
            alert(err);
        }
        var request = new sql.Request(); // crea el objeto de la consulta
        request.query(stringDeConsulta, function (err, resultado) { // ejecuta una consulta de ejemplo
            if (err) { // si hay error en la consulta lo tira como un alert
                alert(err);
            }
            // aca tiene que ir un mensaje que diga que se guardo exitosamente
        });
    });    
}

// recupera una lista de procesos de la db y la carga en la tabla del html
function cargarProcesos(nombre) {
    var tabla = document.getElementById("tabla-procesos"); // variable que apunta a la tabla de procesos
    var stringDeConsulta = "SELECT * FROM Procesos WHERE nombre = '" + nombre + "'"; // crea el string de la consulta
    sql.connect(config, function (err) { // ejecuta la conexion
        if (err) { // si falla al conectarse tira el error en un alert
            alert(err);
        }
        var request = new sql.Request(); // crea el objeto de la consulta
        request.query(stringDeConsulta, function (err, resultado) { // ejecuta una consulta de ejemplo
            if (err) { // si hay error en la consulta lo tira como un alert
                alert(err);
            }
            tablaProcesos = resultado.recordset.listado; // guarda el campo listado en la variable tablaProcesos de lista-de-procesos.js
        });
    });    
    var tablaProcesos = JSON.parse(tablaProcesos); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
    for (var i = 0; i < tablaConvertidaEnJSON.length; i++) { // itera  sobre el array de objects
        var nuevaFila = tabla.insertRow(); //agrega una nueva fila a la tabla de particiones
        var celdaIdProceso = nuevaFila.insertCell(0); // le va agregando las celdas a la fila esa
        var celdaTamano = nuevaFila.insertCell(1);
        var celdaPrioridad = nuevaFila.insertCell(2);
        var celdaTiempoDeArribo = nuevaFila.insertCell(3);
        var celdaCicloDeVida = nuevaFila.insertCell(4);
        celdaIdProceso.innerHTML = tablaConvertidaEnJSON[i].idProceso; // le va cargando los datos a cada una de las celdas
        celdaTamano.innerHTML = tablaConvertidaEnJSON[i].tamaño;
        celdaPrioridad.innerHTML = tablaConvertidaEnJSON[i].prioridad;
        celdaTiempoDeArribo.innerHTML = tablaConvertidaEnJSON[i].tiempoArribo;
        celdaCicloDeVida.innerHTML = tablaConvertidaEnJSON[i].cicloVida;
    }
}

// guarda la lista de colas que esta en el html (y los algoritmos de las otras colas) en la db
function guardarColas() {
    // falta hacer
}

// recupera una lista de colas de la db (y los algoritmos de las otras colas) y la carga en la tabla del html
function cargarColas() {
    // falta hacer
}