// agrega una cola a la tabla
// con info de https://stackoverflow.com/questions/14999927/insert-th-in-thead
function agregarCola() {
    var tablaColas = document.getElementById("tabla-colas");
    //var ultimoIdCola = parseInt(tablaColas.rows(tablaColas.rows.length - 1).cells(0).innerHTML);
    var nuevaFila = tablaColas.insertRow();
    var celdaIdCola = document.createElement("th");
    nuevaFila.appendChild(celdaIdCola);
    var celdaAlgoritmo = nuevaFila.insertCell(1);
    celdaIdCola.innerHTML = tablaColas.rows.length - 1;
    celdaIdCola.scope = "row";
    celdaAlgoritmo.innerHTML = 
        '<div class="form-group">' +
        '  <select class="form-control" id="typealgm">' +
        '    <option value="FCFS">FCFS</option>' +
        '    <option value="SJF">SJF</option>' +
        '    <option value="SRTF">SRTF</option>' +
        '    <option value="Round Robin">Round Robin</option>' +
        '    <option value="Por Prioridad">Por Prioridad</option>' +
        '  </select>' +
        '</div>';
}

// carga una lista con los nombres de todas las listas de colas guardadas
// y abre el modal para poder seleccionar
// con info de https://www.w3schools.com/jsref/met_select_remove.asp
// y de https://www.w3schools.com/jsref/met_select_add.asp
function modalCargarColas() {
    var stringDeConsulta = "SELECT nombre FROM Simulador.dbo.Colas;"; // crea el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
			var listaDeNombres = JSON.parse(this.responseText).recordset;
            if (listaDeNombres.length == 0) { // si no devuelve ningun nombre no hay nada guardado, no abre el modal
                mostrarMensaje("errorColasMultinivel", "No hay ninguna lista de colas guardada");
            }
            else { // si devuelve algo hay algo guardado
                $("#fromdbcolas").modal(); // muestra el modal
                var comboBox = document.getElementById("selectColas"); // variable que apunta al select para elegir lista de colas
                for (var i = comboBox.options.length - 1; i > 0; i--) { // elimina todas las opciones del combobox (menos la que dice "Selecciona")
                    comboBox.remove(i); // si no se hace del ultimo al primero falla
                }
                for (var i = 0; i < listaDeNombres.length; i++) { // va agregando los nombres
                    var option = document.createElement("option");
                    option.text = listaDeNombres[i].nombre;
                    option.value = listaDeNombres[i].nombre;
                    comboBox.add(option);
                }
            }
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}