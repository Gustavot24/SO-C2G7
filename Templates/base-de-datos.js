// Script para conectarse a la base de datos
// robado de https://stackoverflow.com/questions/857670/how-to-connect-to-sql-server-database-from-javascript-in-the-browser
// tambien de http://sirlagz.net/2011/07/02/connecting-to-sql-server-with-javascript/

var conexion;
var rs;

// abre la conexion con la base de datos
// se ejecuta cuando termina de cargar el <body>
// el nombre de usuario y la contraseña dependen de como configuraste tu maquina
// ver como hacer para que ande en cualquier maquina sin tocar nada
// supuestamente esto es re inseguro, pero somos re loco y le mandamos igual
function abrirConexion() {
    conexion = new ActiveXObject("ADODB.Connection") ;
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
function guardarParticiones() {
    var tabla = document.getElementById("tabla-particiones"); // variable que apunta a la tabla de particiones
    var tablaConvertidaEnJSON = "["; // string que va a contener la tabla convertida en jota son
    for (var i = 0, fila; fila = tabla.rows[i]; i++) { // va agregando cada fila de la tabla al json
        tablaConvertidaEnJSON = tablaConvertidaEnJSON + "{" +
            "idParticion: " + fila.cells[0] + ", " +
            "dirInicio: " + fila.cells[1] + ", " +
            "dirFin: " + fila.cells[2] + ", " +
            "tamano: " + fila.cells[3] + "}";
        if (i != tabla.rows.size()) { // si no es la ultima fila, agrega una coma
            tablaConvertidaEnJSON = tablaConvertidaEnJSON + ", ";
        }
     }
    tablaConvertidaEnJSON = tablaConvertidaEnJSON + "]";
    var stringDeConsulta = "INSERT INTO ParticionesFijas (nombre, listado) VALUES " +
        '"' + "aca va el input del nombre de la lista de particiones" + '", ' +
        '"' + tablaConvertidaEnJSON + '";'; // crea el string de la consulta
    rs.open(stringDeConsulta, conexion); // ejecuta la consulta
}

// recupera una lista de particiones de la db y la carga en la tabla del html
function cargarParticiones() {
    var stringDeConsulta = 'SELECT nombre, listado FROM ParticionesFijas WHERE nombre = "' + document.getElementById("sel1").value + '";';
    rs.open(stringDeConsulta, conexion);
    rs.moveFirst;
    while(!rs.eof) {
        // colocar cada fila
        rs.moveNext;
    }
}