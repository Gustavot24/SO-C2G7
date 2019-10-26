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
    if (err) { // si falla al conectarse tira el error en la consola
        console.log(err);
    }
    var request = new sql.Request(); // crea el objeto de la consulta
    request.query('select * from dbo.ParticionesFijas', function (err, recordset) { // ejecuta una consulta de ejemplo
        if (err) { // si hay error en la consulta lo tira en la consola
            console.log(err)
        }
        console.log(recordset); // tira en la consola el resultado de la consulta
    });
});

// cierra la conexion con la base de datos
// se ejecuta al cerrar la pagina o al recargar
// con info de https://stackoverflow.com/questions/13443503/run-javascript-code-on-window-close-or-page-refresh
//window.addEventListener("beforeunload", function(e){
//    
//}, false); 

// guarda la lista de particiones que esta en el html en la db
// con info de https://stackoverflow.com/questions/3065342/how-do-i-iterate-through-table-rows-and-cells-in-javascript
// y de https://www.w3schools.com/jsref/coll_table_tbodies.asp
function guardarParticiones(nombre) {
    var tabla = document.getElementById("tabla-particiones").tBodies.item(0); // variable que apunta a la tabla de particiones
    var tablaConvertidaEnObjeto = []; // array que va a contener las particiones convertidas en objetos
    for (var i = 0, fila; i < tabla.rows.length; i++) { // va agregando cada fila de la tabla a un array de objetos
        fila = tabla.rows[i];
        if (fila.cells[0].innerHTML != "#") { // esto es para que ande al cargar particiones manualmente (la ultima fila no debe guardarse)
            var particionConvertidaEnObjeto = { // crea el objeto de una particion
                idParticion: fila.cells[0].innerHTML,
                dirInicio: fila.cells[1].innerHTML,
                dirFin: fila.cells[2].innerHTML,
                tamano: fila.cells[3].innerHTML,
            };
            tablaConvertidaEnObjeto.push(particionConvertidaEnObjeto); // agrega el objeto recien creado al array
        }
     }
    var tablaConvertidaEnJSON = JSON.stringify(tablaConvertidaEnObjeto); // convierte el array de objetos en un string de un jota son
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
        "'" + tablaConvertidaEnJSON + "';"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    //rs.open(stringDeConsulta, conexion); // ejecuta la consulta
    alert(stringDeConsulta);
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
    var tabla = document.getElementById("tabla-procesos").tBodies[0]; // variable que apunta a la tabla de procesos
    var tablaConvertidaEnObjeto = []; // array que va a contener la lista de procesos convertida en objetos
    for (var i = 0, fila; i < tabla.rows.length - 1; i++) { // va agregando cada fila de la tabla a un array de objetos
        fila = tabla.rows[i];
        var procesosConvertidosEnObjeto = { // crea el objeto de una particion
            idProceso: fila.cells[0].innerHTML,
            tamano: fila.cells[1].innerHTML,
            prioridad: fila.cells[2].innerHTML,
            tiempoDeArribo: fila.cells[3].innerHTML,
            cicloVida: fila.cells[4].innerHTML,
        };
        tablaConvertidaEnObjeto.push(procesosConvertidosEnObjeto); // agrega el objeto recien creado al array
     }
    var tablaConvertidaEnJSON = JSON.stringify(tablaConvertidaEnObjeto); // convierte el array de objetos en un string de un jota son
    var stringDeConsulta = "INSERT INTO Procesos (nombre, listado) VALUES " +
        '"' + nombre + '", ' +
        "'" + tablaConvertidaEnJSON + "';"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    //rs.open(stringDeConsulta, conexion); // ejecuta la consulta
    alert(stringDeConsulta);
}

// recupera una lista de procesos de la db y la carga en la tabla del html
function cargarProcesos(nombre) {
    var tabla = document.getElementById("tabla-procesos"); // variable que apunta a la tabla de procesos
    var stringDeConsulta = 'SELECT * FROM Procesos WHERE nombre = "' + nombre + '";'; // crea el string de la consulta
//    rs.open(stringDeConsulta, conexion); // ejecuta la consulta
//    rs.moveFirst; // se mueve al primer registro de la consulta
    // [0] es el id, [1] es el nombre, [2] es el listado
    var tablaConvertidaEnJSON = JSON.parse(rs.fields(2)); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
    for (var i = 0; i < tablaConvertidaEnJSON.length; i++) { // itera  sobre el array de objects
        var nuevaFila = tabla.insertRow(); //agrega una nueva fila a la tabla de particiones
        var celdaIdProceso = nuevaFila.insertCell(0); // le va agregando las celdas a la fila esa
        var celdaTamano = nuevaFila.insertCell(1);
        var celdaPrioridad = nuevaFila.insertCell(2);
        var celdaTiempoDeArribo = nuevaFila.insertCell(3);
        var celdaCicloDeVida = nuevaFila.insertCell(4);
        celdaIdProceso.innerHTML = tablaConvertidaEnJSON[i].idProceso; // le va cargando los datos a cada una de las celdas
        celdaTamano.innerHTML = tablaConvertidaEnJSON[i].tamano;
        celdaPrioridad.innerHTML = tablaConvertidaEnJSON[i].prioridad;
        celdaTiempoDeArribo.innerHTML = tablaConvertidaEnJSON[i].tiempoDeArribo;
        celdaCicloDeVida.innerHTML = tablaConvertidaEnJSON[i].cicloDeVida;
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