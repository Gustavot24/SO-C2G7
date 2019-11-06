// carga una lista con los nombres de todas las listas de procesos guardadas
// y abre el modal para poder seleccionar
// con info de https://www.w3schools.com/jsref/met_select_remove.asp
// y de https://www.w3schools.com/jsref/met_select_add.asp
function modalCargarProcesos() {
    var stringDeConsulta = "SELECT nombre FROM Simulador.dbo.Procesos;"; // crea el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
			alert(this.responseText);
			var listaDeNombres = JSON.parse(this.responseText).recordset;
            if (listaDeNombres.length == 0) { // si no devuelve ningun nombre no hay nada guardado, no abre el modal
                mostrarMensaje("errorCargaDeTrabajo", "No hay ninguna lista de procesos guardada");
            }
            else { // si devuelve algo hay algo guardado
                $("#fromdblistproc").modal(); // muestra el modal
                var comboBox = document.getElementById("selectProcesos"); // variable que apunta al select para elegir lista de procesos
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