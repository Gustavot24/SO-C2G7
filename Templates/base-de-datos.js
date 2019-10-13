// Script para conectarse a la base de datos
// con info de https://stackoverflow.com/questions/857670/how-to-connect-to-sql-server-database-from-javascript-in-the-browser
// tambien de http://sirlagz.net/2011/07/02/connecting-to-sql-server-with-javascript/

var conexion;
var rs;

// abre la conexion con la base de datos
// se ejecuta cuando termina de cargar el <body>
// el nombre de usuario y la contraseña dependen de como configuraste tu maquina
// ver como hacer para que ande en cualquier maquina sin tocar nada
// supuestamente esto es re inseguro, pero somos re loco y le mandamos igual
function abrirConexion() {
    conexion = new ActiveXObject("ADODB.Connection"); // NO ANDA, VER COMO ARREGLAR
    //var stringDeConexion="Data Source=localhost;Initial Catalog=<catalog>;User ID=<user>;Password=<password>;Provider=SQLOLEDB";
    var stringDeConexion = "driver={sql server};server=localhost;database=Simulador;uid=sa;password="
    conexion.Open(stringDeConexion);
    rs = new ActiveXObject("ADODB.Recordset");
}

// ejemplo de como hacer una consulta, se borra despues
/*
rs.Open("SELECT * FROM table", conexion);
rs.MoveFirst
while(!rs.eof)
{
   document.write(rs.fields(1));
   rs.movenext;
}
*/

// cierra la conexion con la base de datos
// se tiene que ejecutar al cerrar el simulador
// VER COMO HACER ESO
function cerrarConexion() {
    rs.close;
    conexion.close; 
}

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
        '"' + nombre + '", ' +
        tamanoMemoria + ", " + porcentajeSO + ', "' + algoritmo + '", ' +
        "'" + tablaConvertidaEnJSON + "';"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    rs.open(stringDeConsulta, conexion); // ejecuta la consulta
}

// recupera una lista de particiones de la db y la carga en la tabla del html
function cargarParticiones() {
    var tabla = document.getElementById("tabla-particiones"); // variable que apunta a la tabla de particiones
    var stringDeConsulta = 'SELECT nombre, listado FROM ParticionesFijas WHERE nombre = "' + document.getElementById("sel1").value + '";'; // crea el string de la consulta
    rs.open(stringDeConsulta, conexion); // ejecuta la consulta
    rs.moveFirst; // se mueve al primer registro de la consulta
    var tablaConvertidaEnJSON = JSON.parse(rs.fields(2)); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
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
    var tabla = document.getElementById("tabla-procesos").tBodies.item(0); // variable que apunta a la tabla de procesos
    var tablaConvertidaEnObjeto = []; // array que va a contener la lista de procesos convertida en objetos
    for (var i = 0, fila; i < tabla.rows.length - 1; i++) { // va agregando cada fila de la tabla a un array de objetos
        fila = tabla.rows[i];
        var procesosConvertidosEnObjeto = { // crea el objeto de una particion
            idProceso: fila.cells[0].getElementsByTagName("div")[0].getElementsByTagName("input")[0].value,
            tamano: fila.cells[1].getElementsByTagName("div")[0].getElementsByTagName("input")[0].value,
            prioridad: fila.cells[2].getElementsByTagName("div")[0].getElementsByTagName("input")[0].value,
            tiempoDeArribo: fila.cells[3].getElementsByTagName("div")[0].getElementsByTagName("input")[0].value,
            cicloVida: fila.cells[4].getElementsByTagName("div")[0].getElementsByTagName("input")[0].value,
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
function cargarProcesos() {
    // falta hacer
}

// guarda la lista de colas que esta en el html (y los algoritmos de las otras colas) en la db
function guardarColas() {
    // falta hacer
}

// recupera una lista de colas de la db (y los algoritmos de las otras colas) y la carga en la tabla del html
function cargarColas() {
    // falta hacer
}