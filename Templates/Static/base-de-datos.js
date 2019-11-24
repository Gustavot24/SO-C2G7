// Script para conectarse a la base de datos
// con info de https://medium.com/zero-equals-false/how-to-connect-node-js-app-with-sql-server-18a176afae46 (casi todo)
// y de https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs (algunas cosas)

// guarda la lista de particiones que esta en el html en la db
// con info de https://stackoverflow.com/questions/13137597/how-to-get-element-inside-a-td-using-row-index-and-td-index
function guardarParticiones(nombre) {
    if (nombre == "") { // si no se ingreso un nombre no deberia guardar
        mostrarMensaje("errorCondicionesIniciales", "El nombre de la lista de particiones no puede estar en blanco"); // muestra el mensaje de error
        return; // termina la funcion
    }
    var tablaDeParticiones = document.getElementById("tabla-particiones").tBodies.item(0); // variable que apunta al body de la lista de procesos
    var tablaConvertidaEnString = []; // array que va a contener las particiones
    for (var i = 0; i < tablaDeParticiones.rows.length; i++) { // itera para cada fila de la tabla
        if (tablaDeParticiones.rows[i].cells[0].innerHTML != "#") { // esto es para evitar que se guarde la fila donde se cargan los datos manualmente
            var particion = { // crea un objeto de una particion y le carga los datos
                "idParticion": tablaDeParticiones.rows[i].cells[0].innerHTML,
                "dirInicio": tablaDeParticiones.rows[i].cells[1].innerHTML,
                "dirFin": tablaDeParticiones.rows[i].cells[2].innerHTML,
                "tamaño": tablaDeParticiones.rows[i].cells[3].innerHTML,
            }
            tablaConvertidaEnString.push(particion); // agrega esa particion al array
        }
    }
    tablaConvertidaEnString = JSON.stringify(tablaConvertidaEnString); // convierte el array en un string en yeison
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
    console.log(stringDeConsulta); // muestra en la consola el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            console.log(this.responseText); // muestra en la consola la respuesta del servidor
            mostrarMensaje("avisoCondicionesIniciales", "Se guardó la configuración de la memoria principal"); // muestra el mensaje de que todo salio bien
            seGuardaronLasParticiones = true; // pone a true la variable que indica que se guardaron las particiones
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}

// recupera una lista de particiones de la db y la carga en la tabla del html
// con info de https://stackoverflow.com/questions/10911526/how-do-i-change-an-html-selected-option-using-javascript
// y de https://www.w3schools.com/jsref/prop_range_value.asp
function cargarParticiones(nombre) {
    var tabla = document.getElementById("tabla-particiones").tBodies.item(0); // variable que apunta a la tabla de particiones
    var stringDeConsulta = "SELECT * FROM Simulador.dbo.ParticionesFijas WHERE nombre = '" + nombre + "';"; // crea el string de la consulta
    console.log(stringDeConsulta); // muestra por consola el string de consulta
    var tablaParticiones; // variable que va a contener el json de las particiones sacado de la db
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            console.log(this.responseText); // muestra por consola la respuesta del servidor
            document.getElementById("prtfixed").checked = true; // chequea el radio de particiones fijas
            fixed(); // ejecuta la funcion ???
            tabla.deleteRow(0); // elimina la primera fila de la tabla (donde se cargan los datos de una particion)
            document.getElementById("div-particiones").style.visibility="visible"; // hace visible el div que contiene la tabla de particiones
            tablaParticiones = JSON.parse(this.responseText).recordset[0]; // convierte a un array de objetos la tabla de particiones sacada de la db
            condicionesInciales.tipoParticion = "F"; // en la variable global de condiciones iniciales pone que el tipo de particion es fija
            document.getElementById("mp").value = tablaParticiones.tamanoMemoria; // asigna el valor del tamaño de memoria al select
            condicionesInciales.tamanoMP = tablaParticiones.tamanoMemoria; // guarda el tamaño de la memoria en la variable global de condiciones iniciales
            document.getElementById("myRange").value = tablaParticiones.porcentajeSO; // asigna el valor del porcentaje del SO al range
            document.getElementById("demo").innerHTML = tablaParticiones.porcentajeSO; // asigna el valor del porcentaje del SO al label
            condicionesInciales.porcentajeSO = parseInt(tablaParticiones.porcentajeSO) / 100; // asigna el porcentaje ocupado por el SO a la variable de condiciones iniciales
            condicionesInciales.tamanoSO = Math.ceil(condicionesInciales.tamanoMP * condicionesInciales.porcentajeSO); // asigna el tamaño del SO a la variable de condiciones iniciales
            if (tablaParticiones.algoritmo == "firstfit") { // si el algoritmo es first fit chequea su radio
                document.getElementById("bstfit").checked = false;
                document.getElementById("frtfit").checked = true;
                condicionesInciales.algoritmo = "FF"; // pone en la variable de condiciones iniciales que el algoritmo es first fit
            }
            if (tablaParticiones.algoritmo == "bestfit") { // si el algoritmo es best fit chequea su radio
                document.getElementById("frtfit").checked = false;
                document.getElementById("bstfit").checked = true;
                condicionesInciales.algoritmo = "B"; // pone en la variable de condiciones iniciales que el algoritmo es best fit
            }
            var tablaConvertidaEnJSON = JSON.parse(tablaParticiones.listado); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
            for (var i = 0; i < tablaConvertidaEnJSON.length; i++) { // itera  sobre el array de objects
                var nuevaFila = tabla.insertRow(); // agrega una nueva fila a la tabla de particiones
                var celdaIdParticion = nuevaFila.insertCell(0); // le va agregando las celdas a la fila esa
                var celdaDirInicio = nuevaFila.insertCell(1);
                var celdaDirFin = nuevaFila.insertCell(2);
                var celdaTamano = nuevaFila.insertCell(3);
                celdaIdParticion.innerHTML = tablaConvertidaEnJSON[i].idParticion; // le va cargando los datos a cada una de las celdas
                celdaDirInicio.innerHTML = tablaConvertidaEnJSON[i].dirInicio;
                celdaDirFin.innerHTML = tablaConvertidaEnJSON[i].dirFin;
                celdaTamano.innerHTML = tablaConvertidaEnJSON[i].tamaño;
                var particion = { // crea un objeto con los datos dela particion recien cargada
                    idParticion: Number(tablaConvertidaEnJSON[i].idParticion),
                    dirInicio: Number(tablaConvertidaEnJSON[i].dirInicio),
                    dirFin: Number(tablaConvertidaEnJSON[i].dirFin),
                    tamaño: Number(tablaConvertidaEnJSON[i].tamaño),
                    estado: 0,
                    idProceso: null,
                    FI: 0,
                };
                condicionesInciales.tablaParticiones.push(particion); // pone esa particion en el array tablaParticiones de la variable de condiciones iniciales
            }
            //cargarParticionesVbles(); // ejecuta esta funcion de algoritmo.js para crear el object que tiene todos los datos de la pagina        
            mostrarMensaje("avisoCondicionesIniciales", "Se cargó la configuración de la memoria principal"); // muestra un mensaje de que se cargo todo bien
            seGuardaronLasParticiones = true; // pone a true la variable que indica que se guardaron las particiones
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}

// guarda la lista de procesos que esta en el html en la db
function guardarProcesos(nombre) {
    if (nombre == "") { // si no se ingreso un nombre no deberia guardar
        mostrarMensaje("errorCargaDeTrabajo", "El nombre de la lista de procesos no puede estar en blanco"); // muestra el mensaje de error
        return; // termina la funcion
    }
    obtenerLista(); // ejecuta la funcion que crea el array de objetos de procesos
    var tablaConvertidaEnString = JSON.stringify(tablaProcesos); // convierte el listado de procesos en un string de un jota son
    var stringDeConsulta = "INSERT INTO Simulador.dbo.Procesos (nombre, listado) VALUES (" +
        "'" + nombre + "', " +
        "'" + tablaConvertidaEnString + "');"; // crea el string de la consulta
    console.log(stringDeConsulta); // muestra en consola el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            console.log(this.responseText); // muestra en consola la respuesta del servidor
            mostrarMensaje("avisoCargaDeTrabajo", "Se guardó la lista de procesos"); // muestra el mensaje de que todo salio bien
            seGuardaronLosProcesos = true; // pone a true la variable que indica que se guardaron los procesos
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}

// recupera una lista de procesos de la db y la carga en la tabla del html
function cargarProcesos(nombre) {
    nuevaLista(); // ejecuta la funcion que prepara la tabla para ingresar una nueva lista
    var tabla = document.getElementById("tabla-procesos").tBodies.item(0); // variable que apunta a la tabla de procesos
    var tablaConvertidaEnJSON; // variable que va a contener la respuesta del servidor convertida en objeto
    var stringDeConsulta = "SELECT * FROM Simulador.dbo.Procesos WHERE nombre = '" + nombre + "'"; // crea el string de la consulta
    console.log(stringDeConsulta); // muestra por consola el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            console.log(this.responseText); // muestra por consola la respuesta del servidor
            tablaConvertidaEnJSON = JSON.parse(this.responseText); // convierte la respuesta del servidor en un objeto
            tablaProcesos = JSON.parse(tablaConvertidaEnJSON.recordset[0].listado); // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
            for (var i = 0; i < tablaProcesos.length; i++) { // itera sobre el array de objects y va cargando los datos
                tabla.rows[i].cells[0].innerHTML = tablaProcesos[i].idProceso;
                tabla.rows[i].cells[1].children[0].value = tablaProcesos[i].tamaño;
                tabla.rows[i].cells[2].children[0].selectedIndex = tablaProcesos[i].prioridad - 1;
                tabla.rows[i].cells[3].children[0].value = tablaProcesos[i].tiempoArribo;
                tabla.rows[i].cells[4].children[0].value = tablaProcesos[i].cicloVida.join("-");
                guardarProc(); // ejecuta la funcion que guarda ese proceso cargado en la tabla
                if (i < tablaProcesos.length - 1) { // si no es el ultimo proceso que falta cargar crea una nueva fila para cargar el siguiente
                    generarFila();
                }
            }
            mostrarMensaje("avisoCargaDeTrabajo", "Se cargó la lista de procesos"); // muestra un mensaje de que se cargo todo bien
            seGuardaronLosProcesos = true; // pone a true la variable que indica que se guardaron los procesos
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}

// guarda la lista de colas que esta en el html en la db
function guardarColas(nombre) {
    if (nombre == "") { // si no se ingreso un nombre no deberia guardar
        mostrarMensaje("errorColasMultinivel", "El nombre de la lista de colas no puede estar en blanco"); // muestra el mensaje de error
        return; // termina la funcion
    }
    var tablaConvertidaEnString = []; // tabla que va a contener el array de colas a meter en la db
    var tablaColas = document.getElementById("tabla-colas").tBodies.item(0); // variable que apunta a la tabla de colas
    for (var i = 0; i < tablaColas.rows.length; i++) { // itera sobre las filas de la tabla de colas
        if (tablaColas.rows[i].style.display != "none") {
            var cola = { // crea un objeto con los datos de una cola
                idCola: tablaColas.rows[i].cells[0].innerHTML,
                algoritmo: document.getElementById("typealgm" + (i + 1)).value,
                quantum: document.getElementById("quantum" + (i + 1)).value,
            }
            tablaConvertidaEnString.push(cola); // agrega ese objeto al array de colas
        }
    }
    tablaConvertidaEnString = JSON.stringify(tablaConvertidaEnString); // convierte el array de colas en un string json
    var stringDeConsulta = "INSERT INTO Simulador.dbo.Colas (nombre, listado) VALUES (" +
        "'" + nombre + "', " +
        "'" + tablaConvertidaEnString + "');"; // crea el string de la consulta
    console.log(stringDeConsulta); // muestra por consola el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            console.log(this.responseText); // muestra por consola la respuesta del servidor
            mostrarMensaje("avisoColasMultinivel", "Se guardó la lista de colas de CPU"); // muestra un mensaje de que todo salio bien
            seGuardaronLasColas = true; // pone a true la variable que indica que se guardaron las colas
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}

// recupera una lista de colas de la db y la carga en la tabla del html
function cargarColas(nombre) {
    var tabla = document.getElementById("tabla-colas").tBodies.item(0); // variable que apunta a la tabla de colas
    var tablaColas;
    var stringDeConsulta = "SELECT * FROM Simulador.dbo.Colas WHERE nombre = '" + nombre + "';"; // crea el string de la consulta
    console.log(stringDeConsulta); // muestra por consola el string de consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            console.log(this.responseText); // muestra por consola la respuesta del servidor
            tablaColas = JSON.parse(this.responseText).recordset[0].listado; // convierte al string del json (directamente sacado del resultado de la consulta) en un array de objects
            tablaColas = JSON.parse(tablaColas); // convierte el string de la lista de colas en un array de objetos
            for (var i = 0; i < tablaColas.length; i++) { // itera sobre el array de objects
                if (tabla.rows[i].style.display == "none") {
                    tabla.rows[i].removeAttribute("style");
                }
                document.getElementById("typealgm" + (i + 1)).value = tablaColas[i].algoritmo;
                document.getElementById("quantum" + (i + 1)).value = tablaColas[i].quantum;
            }
            mostrarMensaje("avisoColasMultinivel", "Se cargó la lista de colas"); // muestra un mensaje de que se cargo todo bien
            seGuardaronLasColas = true; // pone a true la variable que indica que se guardaron las colas
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}