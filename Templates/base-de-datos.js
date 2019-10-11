// Script para conectarse a la base de datos
// robado de https://stackoverflow.com/questions/857670/how-to-connect-to-sql-server-database-from-javascript-in-the-browser
// tambien de http://sirlagz.net/2011/07/02/connecting-to-sql-server-with-javascript/

var conexion;
var rs;

// abre la conexion con la base de datos
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

rs.Open("SELECT * FROM table", conexion);
rs.MoveFirst
while(!rs.eof)
{
   document.write(rs.fields(1));
   rs.movenext;
}

function cerrarConexion() {
    rs.close;
    conexion.close; 
}

// guarda la lista de particiones que esta en el html en la db
function guardarParticiones() {
    var stringDeConsulta = "INSERT INTO ParticionesFijas (nombre, listado) VALUES" + "";
    rs.open(stringDeConsulta, conexion);
}

// recupera una lista de particiones de la db y la carga en la tabla del html
function cargarParticiones() {
    var stringDeConsulta = "SELECT nombre, listado FROM ParticionesFijas WHERE nombre = " + document.getElementById("sel1").value + ";";

}