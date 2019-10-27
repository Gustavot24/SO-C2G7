//Pestaña: "Carga de Trabajo"
//Aquí se cargan los procesos
//"tablaProcesos" es un array que contiene todos los procesos que fueron cargados

var idProc=1;
var tablaProcesos=[]; //Lista de procesos
var caracter="-"; //Caracter de separación del ciclo de vida


function agregarProc() {
	agregarProc:{
		var numeros = ["0","1","2","3","4","5","6","7","8","9"]; //Array usado para validar los tipos de datos de entrada
		var i; //Índice para recorrer los arrays
		
		//TAMAÑO DEL PROCESO
		//Se convierte a array para validarlo
		var tamProc = (document.getElementById(`tamProc${idProc}`).value).split(""); 
		
		//Si el campo de entrada está vacio
		if (tamProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Tamaño del Proceso. Inténtelo nuevamente.");
			break agregarProc;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < tamProc.length; i++) {
			if (!(tamProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Tamaño del Proceso: Debe ingresar número entero. Inténtelo nuevamente.");
				break agregarProc;
			}
		}
		//Se obtiene en tipo de dato numérico
		tamProc = Number(document.getElementById(`tamProc${idProc}`).value);
		
		
		//PRIORIDAD DEL PROCESO
		//Se obtiene en tipo de dato numérico
		var prioProc = Number(document.getElementById(`prioProc${idProc}`).value); 
		
		
		//TIEMPO DE ARRIBO DEL PROCESO
		//Se convierte a array para validarlo
		var tArrProc = (document.getElementById(`tArrProc${idProc}`).value).split(""); 
        
		//Si el campo de entrada está vacio
		if (tArrProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Tiempo de Arribo. Inténtelo nuevamente.");
			break agregarProc;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < tArrProc.length; i++) {
			if (!(tArrProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Tiempo de Arribo: Debe ingresar número entero. Inténtelo nuevamente.");
				break agregarProc;
			}
		}
		
		//Se obtiene en tipo de dato numérico
		tArrProc = Number(document.getElementById(`tArrProc${idProc}`).value);
		
		//CICLO DE VIDA DEL PROCESO
		//Se convierte a array para validarlo
		var cvProc = (document.getElementById(`cvProc${idProc}`).value).split("");
		
		//Si el campo de entrada está vacio
		if (cvProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Ciclo de Vida. Inténtelo nuevamente.");
			break agregarProc;
		}
		
		//Se valida que el formato de entrada sea el correcto: CPU-E-CPU-S-CPU
		i = 0;
		var cont = 1;
		while (i < cvProc.length) {
			if (cont > 5) {
				mostrarMensaje("errorCargaDeTrabajo", "1Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
			break agregarProc;
			}
			if (!(cvProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "2Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
				break agregarProc;
			} else {
				cont++;
				while ((i < cvProc.length) && (cvProc[i] in numeros)) {
					i++;
				}
			}
			if (i < cvProc.length) {
				if ((cvProc[i] != caracter) || (i == (cvProc.length-1))) {
					mostrarMensaje("errorCargaDeTrabajo", "3Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
					break agregarProc;
				}
				i++;
			}
		}
		//Se obtiene el string de entrada
		cvProc = document.getElementById(`cvProc${idProc}`).value;
	 
		
		//Se bloquea la edición de los datos del proceso anteriormente ingresados
		x=document.getElementById('tabla-procesos').rows[parseInt(idProc,10)].cells;
        x[parseInt(0,10)].innerHTML = idProc;
		x[parseInt(1,10)].innerHTML = tamProc;
		x[parseInt(2,10)].innerHTML = prioProc;
		x[parseInt(3,10)].innerHTML = tArrProc;
        x[parseInt(4,10)].innerHTML = cvProc;
		
		//Se convierte el string de entrada del ciclo de vida en un array
		var cvProc = cvProc.split(caracter);
		
		//Se convierte los valores del array a tipo numérico
		var i;
		for (i=0; i<cvProc.length; i++){
			cvProc[i] = parseInt(cvProc[i]);
		}	
		
		//Se almacenan los datos del proceso en un object
		var proceso = {
				idProceso: idProc,
				tamaño: tamProc,
				prioridad: prioProc,
				tiempoArribo: tArrProc,
				cicloVida: cvProc,
			};
		//Se agrega el proceso al array de la lista de procesos	(tablaProcesos)
		tablaProcesos.push(proceso);
		
		//Al agregar el primer proceso se elimina el botón "Cargar Lista"
		if (idProc ==1) {
			var boton = document.getElementById("botonCargarLista");	
				padre = boton.parentNode;
				padre.removeChild(boton);
		}
		
		idProc++; //Se incrementa el número de Id que corresponde al siguiente proceso
        
		//Se genera la fila del siguiente proceso a cargar
		var htmlTags = '<tr>'+               
			'<td>' + idProc + '</td>' +
			'<td>' +
                                    '<div class="form-group">' +
                                        `<input type="text" class="form-control" id='tamProc${idProc}' placeholder="Tamaño del Proceso">` +
                                    '</div>' +
                                '</td>' +	
			'<td>' +
                                    '<div class="form-group">' +
                                        `<select class="form-control" id='prioProc${idProc}'>` +
                                          '<option>1</option>' +
                                          '<option>2</option>' +
                                          '<option>3</option>' +
                                        '</select>' +
                                      '</div>' +
                                '</td>' +
                                '<td>' +
                                    '<div class="form-group">' +
                                        `<input type="text" class="form-control" id='tArrProc${idProc}' placeholder="Tiempo de Arribo">` +
                                    '</div>' +
                                '</td>' +
								'<td>' +
									'<div class="form-group">' +
                                        `<input type="text" class="form-control" id='cvProc${idProc}' placeholder="CPU-E-CPU-S-CPU">` +
                                    '</div>' +
								'</td>';
								
            $('#tabla-procesos tbody').append(htmlTags);
		
	}
	console.log(tablaProcesos);
}

function guardarEnDB() {
	guardarEnDB:{
		//SE VERIFICA QUE REALMENTE SE DESEA ALMACENAR LA LISTA DE PROCESOS
		//En caso de cancelar la operación simplemente se pueden seguir agregando nuevos procesos a la lista e intentar guardarlo nuevamente...
		var nombreLista = prompt("Ingrese el nombre de la lista: ", "Lista de Procesos 1");
		if (nombreLista == null) {
			mostrarMensaje("avisoCargaDeTrabajo", "La operación ha sido cancelada.");
			break guardarEnDB;
		} else {
				if (nombreLista == "") {
					while (nombreLista == "") {
						mostrarMensaje("errorCargaDeTrabajo", "No se ha ingresado el nombre de la lista. Inténtelo nuevamente.");
						nombreLista = prompt("Ingrese el nombre de la lista: ", "Lista de Procesos 1");
						if (nombreLista == null) {
							mostrarMensaje("avisoCargaDeTrabajo", "La operación ha sido cancelada.");
							break guardarEnDB;
						}
					}
				}
			}
			
		//LUEGO SE AGREGA EL ÚLTIMO PROCESO DE ENTRADA A LA LISTA DE PROCESOS A GUARDAR EN DB
		var numeros = ["0","1","2","3","4","5","6","7","8","9"]; //Array usado para validar los tipos de datos de entrada
		var i; //Índice para recorrer los arrays
		
		//TAMAÑO DEL PROCESO
		//Se convierte a array para validarlo
		var tamProc = (document.getElementById(`tamProc${idProc}`).value).split(""); 
		
		//Si el campo de entrada está vacio
		if (tamProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Tamaño del Proceso. Inténtelo nuevamente.");
			break guardarEnDB;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < tamProc.length; i++) {
			if (!(tamProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Tamaño del Proceso: Debe ingresar número entero. Inténtelo nuevamente.");
				break guardarEnDB;
			}
		}
		//Se obtiene en tipo de dato numérico
		tamProc = Number(document.getElementById(`tamProc${idProc}`).value);
		
		
		//PRIORIDAD DEL PROCESO
		//Se obtiene en tipo de dato numérico
		var prioProc = Number(document.getElementById(`prioProc${idProc}`).value); 
		
		
		//TIEMPO DE ARRIBO DEL PROCESO
		//Se convierte a array para validarlo
		var tArrProc = (document.getElementById(`tArrProc${idProc}`).value).split(""); 
        
		//Si el campo de entrada está vacio
		if (tArrProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Tiempo de Arribo. Inténtelo nuevamente.");
			break guardarEnDB;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < tArrProc.length; i++) {
			if (!(tArrProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Tiempo de Arribo: Debe ingresar número entero. Inténtelo nuevamente.");
				break guardarEnDB;
			}
		}
		
		//Se obtiene en tipo de dato numérico
		tArrProc = Number(document.getElementById(`tArrProc${idProc}`).value);
		
		//CICLO DE VIDA DEL PROCESO
		//Se convierte a array para validarlo
		var cvProc = (document.getElementById(`cvProc${idProc}`).value).split("");
		
		//Si el campo de entrada está vacio
		if (cvProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Ciclo de Vida. Inténtelo nuevamente.");
			break guardarEnDB;
		}
		
		//Se valida que el formato de entrada sea el correcto: CPU-E-CPU-S-CPU
		i = 0;
		var cont = 1;
		while (i < cvProc.length) {
			if (cont > 5) {
				mostrarMensaje("errorCargaDeTrabajo", "1Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
			break guardarEnDB;
			}
			if (!(cvProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "2Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
				break guardarEnDB;
			} else {
				cont++;
				while ((i < cvProc.length) && (cvProc[i] in numeros)) {
					i++;
				}
			}
			if (i < cvProc.length) {
				if ((cvProc[i] != caracter) || (i == (cvProc.length-1))) {
					mostrarMensaje("errorCargaDeTrabajo", "3Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
					break guardarEnDB;
				}
				i++;
			}
		}
		//Se obtiene el string de entrada
		cvProc = document.getElementById(`cvProc${idProc}`).value;
	 
		
		//Se bloquea la edición de los datos del proceso anteriormente ingresados
		x=document.getElementById('tabla-procesos').rows[parseInt(idProc,10)].cells;
        x[parseInt(0,10)].innerHTML = idProc;
		x[parseInt(1,10)].innerHTML = tamProc;
		x[parseInt(2,10)].innerHTML = prioProc;
		x[parseInt(3,10)].innerHTML = tArrProc;
        x[parseInt(4,10)].innerHTML = cvProc;
		
		//Se convierte el string de entrada del ciclo de vida en un array
		var cvProc = cvProc.split(caracter);
		
		//Se convierte los valores del array a tipo numérico
		var i;
		for (i=0; i<cvProc.length; i++){
			cvProc[i] = parseInt(cvProc[i]);
		}	
		
		//Se almacenan los datos del proceso en un object
		var proceso = {
				idProceso: idProc,
				tamaño: tamProc,
				prioridad: prioProc,
				tiempoArribo: tArrProc,
				cicloVida: cvProc,
			};
		//Se agrega el proceso al array de la lista de procesos	(tablaProcesos)
		tablaProcesos.push(proceso);
		
		mostrarMensaje("avisoCargaDeTrabajo", "Lista de Procesos almacenada correctamente.");
		
		//Se eliminan los botones "Nuevo Proceso", "Guardar Lista", "Cargar Lista"
		var botones = document.getElementById("botonesCargaDeTrabajo");
		while (botones.firstChild) {
			botones.removeChild(botones.firstChild);
		}
		// Y se agrega el botón "Siguiente"
		var htmlTags = '<div align="right">'+
                        `<button type="button"  class="btn btn-secondary"  style="visibility: visible" onclick="siguiente()">Siguiente</button>`+
                       '</div>'
			$('#botonesCargaDeTrabajo').append(htmlTags);
			
		//La lista de procesos queda almacenada en el array "tablaProcesos"
	}
}

function cargarDesdeDB() {
	//Cargar lista de procesos desde la DB
}

function siguiente() {
	//Acción del botón "Siguiente"
}