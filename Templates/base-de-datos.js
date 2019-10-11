// Script para conectarse a la base de datos
// robado de https://stackoverflow.com/questions/857670/how-to-connect-to-sql-server-database-from-javascript-in-the-browser
// tambien de http://sirlagz.net/2011/07/02/connecting-to-sql-server-with-javascript/

function abrirConexion() {
    var conexion = new ActiveXObject("ADODB.Connection") ;
    //var stringDeConexion="Data Source=localhost;Initial Catalog=<catalog>;User ID=<user>;Password=<password>;Provider=SQLOLEDB";
    var stringDeConexion = "driver={sql server};server=server1;database=db1;uid=username;password=password"
    conexion.Open(stringDeConexion);
    var rs = new ActiveXObject("ADODB.Recordset");
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
