// Script para conectarse a la base de datos
// con info de https://medium.com/zero-equals-false/how-to-connect-node-js-app-with-sql-server-18a176afae46 (casi todo)
// y de https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs (algunas cosas)

// primero tenes que seguir todos los pasos del primer link (menos el que tiene el codigo js)
// despues tenes que estar en la carpeta Templates
// despues ejecutar npm init -y (no creo que sea necesario, ya hice y subi al git)
// y despues npm install mssql (idem)

// FALTA HACER:
// QUE DE ALGUN MODO SE CREE LA DB Y LAS TABLAS ANTES DE ARRANCAR EL PROGRAMA

// cierra la conexion con la base de datos
// se ejecuta al cerrar la pagina o al recargar
// con info de https://stackoverflow.com/questions/13443503/run-javascript-code-on-window-close-or-page-refresh
//window.addEventListener("beforeunload", function(e){
//    
//}, false); 

// guarda la lista de particiones que esta en el html en la db
// con info de https://stackoverflow.com/questions/208105/how-do-i-remove-a-property-from-a-javascript-object
function guardarParticiones(nombre) {
    /*var tablaConvertidaEnString = condicionesInciales.tablaParticiones; // convierte el array de particiones en un string de un jota son
    for (var i = 0; i < tablaConvertidaEnString.length; i++) {
        delete tablaConvertidaEnString[i].estado;
        delete tablaConvertidaEnString[i].idProceso;
        delete tablaConvertidaEnString[i].FI;
    }*/
    var tablaDeParticiones = document.getElementById("tabla-particiones").tBodies.item(0);
    var tablaConvertidaEnString = [];
    for (var i = 0; i < tablaDeParticiones.length; i++) { //FALTA HACER
        var particion = {
            "idParticion": idPart,
            "dirInicio": direccionLibre,
            "dirFin": dirfin,
            "tamaño": tamano,            
        }
    }
    tablaConvertidaEnString = JSON.stringify(tablaConvertidaEnString);
    var tamanoMemoria = document.getElementById("mp").value; // obtiene el tamaño de la memoria
    var porcentajeSO = document.getElementById("myRange").value; // obtiene el porcentaje ocupado por el SO
    var algoritmo; //declara una variable para guardar el algoritmo
    if (document.getElementById("frtfit").checked == true) { // depende del radiobutton chequeado asigna el algoritmo
        algoritmo = "firstfit";
    }
    else {
        algoritmo = "bestfit";
    }
    var stringDeConsulta = "INSERT INTO Simulador.dbo.ParticionesFijas (nombre, tamanoMemoria, porcentajeSO, algoritmo, listado) VALUES (" +
        "'" + nombre + "', " +
        tamanoMemoria + ", " + porcentajeSO + ", '" + algoritmo + "', " +
        "'" + tablaConvertidaEnString + "');"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    alert(stringDeConsulta);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            mostrarMensaje("avisoCondicionesIniciales", "Se guardó la configuración de la memoria principal");
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true);
    xhttp.send();
}

// recupera una lista de particiones de la db y la carga en la tabla del html
// con info de https://stackoverflow.com/questions/10911526/how-do-i-change-an-html-selected-option-using-javascript
// y de https://www.w3schools.com/jsref/prop_range_value.asp
function cargarParticiones(nombre) {
    var tabla = document.getElementById("tabla-particiones"); // variable que apunta a la tabla de particiones
    var stringDeConsulta = 'SELECT * FROM ParticionesFijas WHERE nombre = "' + nombre + '";'; // crea el string de la consulta
    var tablaParticiones;
    sql.connect(config, function (err) { // ejecuta la conexion
        if (err) { // si falla al conectarse tira el error en un alert
            alert(err);
        }
        var request = new sql.Request(); // crea el objeto de la consulta
        request.query(stringDeConsulta, function (err, resultado) { // ejecuta una consulta de ejemplo
            if (err) { // si hay error en la consulta lo tira como un alert
                alert(err);
            }
            tablaParticiones = resultado.recordset[0]; // guarda el campo listado para cargar los datos en la pagina
        });
    });    
    switch (tablaParticiones.tamanoMemoria) { // asigna el valor del tamaño de memoria al select
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
    document.getElementById("myRange").value = tablaParticiones.porcentajeSO; // asigna el valor del porcentaje del SO al range
    if (tablaParticiones.algoritmo = "firstfit") {
        document.getElementById("frtfit").checked = true;
    }
    else {
        document.getElementById("bstfit").checked = true;
    }
    var tablaConvertidaEnJSON = JSON.parse(tablaParticiones.listado); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
    for (var i = 0; i < tablaConvertidaEnJSON.length; i++) { // itera  sobre el array de objects
        var nuevaFila = tabla.insertRow(); //agrega una nueva fila a la tabla de particiones
        var celdaIdParticion = nuevaFila.insertCell(0); // le va agregando las celdas a la fila esa
        var celdaDirInicio = nuevaFila.insertCell(1);
        var celdaDirFin = nuevaFila.insertCell(2);
        var celdaTamano = nuevaFila.insertCell(3);
        celdaIdParticion.innerHTML = tablaConvertidaEnJSON[i].idParticion; // le va cargando los datos a cada una de las celdas
        celdaDirInicio.innerHTML = tablaConvertidaEnJSON[i].dirInicio;
        celdaDirFin.innerHTML = tablaConvertidaEnJSON[i].dirFin;
        celdaTamano.innerHTML = tablaConvertidaEnJSON[i].tamaño;
    }
    cargarParticionesVbles(); // ejecuta esta funcion de algoritmo.js para crear el object que tiene todos los datos de la pagina
}

// guarda la lista de procesos que esta en el html en la db
// con info de https://stackoverflow.com/questions/13137597/how-to-get-element-inside-a-td-using-row-index-and-td-index
function guardarProcesos(nombre) {
    if (nombre == "") {
        $('#guardarLista').modal('hide');
        mostrarMensaje("errorCargaDeTrabajo", "El nombre de la lista de procesos no puede estar en blanco");
        return;
    }
    var tablaConvertidaEnString = JSON.stringify(tablaProcesos); // convierte el listado de procesos en un string de un jota son
    var stringDeConsulta = "INSERT INTO Simulador.dbo.Procesos (nombre, listado) VALUES (" +
        "'" + nombre + "', " +
        "'" + tablaConvertidaEnString + "')"; // crea el string de la consulta
        // si no me equivoco esto es re vulnerable a una inyeccion sql
    alert(stringDeConsulta);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            $('#guardarLista').modal('hide');
            mostrarMensaje("avisoCargaDeTrabajo", "Se guardó la lista de procesos");
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true);
    xhttp.send();
}

// recupera una lista de procesos de la db y la carga en la tabla del html
function cargarProcesos(nombre) {
    var tabla = document.getElementById("tabla-procesos"); // variable que apunta a la tabla de procesos
    var tablaConvertidaEnJSON;
    var stringDeConsulta = "SELECT * FROM Simulador.dbo.Procesos WHERE nombre = '" + nombre + "'"; // crea el string de la consulta
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            tablaConvertidaEnJSON = JSON.parse(this.responseText);
            tablaProcesos = tablaConvertidaEnJSON.recordset[0].listado; // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
            for (var i = 0; i < tablaProcesos.length; i++) { // itera  sobre el array de objects
                var nuevaFila = tabla.insertRow(); //agrega una nueva fila a la tabla de particiones
                var celdaIdProceso = nuevaFila.insertCell(0); // le va agregando las celdas a la fila esa
                var celdaTamano = nuevaFila.insertCell(1);
                var celdaPrioridad = nuevaFila.insertCell(2);
                var celdaTiempoDeArribo = nuevaFila.insertCell(3);
                var celdaCicloDeVida = nuevaFila.insertCell(4);
                celdaIdProceso.innerHTML = tablaProcesos[i].idProceso; // le va cargando los datos a cada una de las celdas
                celdaTamano.innerHTML = tablaProcesos[i].tamaño;
                celdaPrioridad.innerHTML = tablaProcesos[i].prioridad;
                celdaTiempoDeArribo.innerHTML = tablaProcesos[i].tiempoArribo;
                celdaCicloDeVida.innerHTML = tablaProcesos[i].cicloVida;
            }
            mostrarMensaje("avisoCargaDeTrabajo", "Se cargó la lista de procesos");        
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true);
    xhttp.send();
}

// guarda la lista de colas que esta en el html en la db
function guardarColas() {
    var tablaConvertidaEnString = 0;
    alert(stringDeConsulta);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            mostrarMensaje("avisoColasMultinivel", "Se guardó la lista de colas de CPU");
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true);
    xhttp.send();
}

// recupera una lista de colas de la db y la carga en la tabla del html
function cargarColas() {
    // falta hacer
}