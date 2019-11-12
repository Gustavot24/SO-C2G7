//Pestaña: "Carga de Trabajo"
//Aquí se carga la lista de procesos

var idProc = 1; //Variable para asignar automaticamente el número de id a los procesos
var cantProc = 0; //Variable para controlar la cantidad de procesos de la lista

var cargando = false; //Variable booleana para saber si se están cargando los datos de un nuevo proceso
var editando = false; //Variable booleana para saber si se están editando los datos un proceso 
var anulado = false; //Variable booleana para saber si la carga de los datos de un nuevo proceso fue anulada

var seGuardaronLosProcesos = false;

function generarFila() {
	
	//Si no se está cargando o editando un proceso
	if ((cargando == false) && (editando == false))
	{
		//Si se había anulado la carga de los datos del último proceso nuevo
		if (anulado == true) {
			
			//Se habilita la fila completa para cargar los datos del nuevo proceso
			document.getElementById(idProc).style.display = "table-row";
			
			//Se resetean los valores de entrada (por defecto)
			document.getElementById("tamProc"+idProc).value = "";
			document.getElementById("prioProc"+idProc).value = 1;
			document.getElementById("tArrProc"+idProc).value = "";
			document.getElementById("cvProc"+idProc).value = "";
			
		} else {
			
			//Variable para agregar los elementos html de una nueva fila
			var htmlTags = '<tr id="'+idProc+'">'+
								'<th scope="row">'+idProc+'</th>'+
									'<td class="celda">'+
										'<input type="text" class="form-control" id="tamProc'+idProc+'" placeholder="Tamaño del Proceso">'+
									'</td>'+
									'<td class="celda">'+
										'<select class="form-control" id="prioProc'+idProc+'">'+
											'<option>1</option>'+
											'<option>2</option>'+
											'<option>3</option>'+
										'</select>'+
									'</td>'+
									'<td class="celda">'+								
										'<input type="text" class="form-control" id="tArrProc'+idProc+'" placeholder="Tiempo de Arribo">'+
									'</td>'+
									'<td class="celda">'+
										'<input type="text" class="form-control" id="cvProc'+idProc+'" placeholder="CPU-E-CPU-S-CPU">'+
									'</td>'+
									'<td class="eliminado" id="eliminado'+idProc+'" colSpan="4" style="display:none" align="center">'+
										'<em>Proceso eliminado.</em>'+
									'</td>'+
									'<td id="opciones'+idProc+'">'+
										'<button class="btn btn-outline-dark" id="botonGuardar'+idProc+'" style="display:block" onclick="guardarProc()">'+'<i class="material-icons align-middle">save</i>'+'</button>'+
										'<button class="btn btn-outline-dark" id="botonAnular'+idProc+'" style="display:block" onclick="anularProc()">'+'<i class="material-icons align-middle">highlight_off</i>'+'</button>'+
										'<button class="btn btn-outline-dark" id="botonEditar'+idProc+'" style="display:none" onclick="editar(this)">'+'<i class="material-icons align-middle">create</i>'+'</button>'+
										'<button class="btn btn-outline-dark" id="botonEliminar'+idProc+'" style="display:none" onclick="eliminar(this)">'+'<i class="material-icons align-middle">delete_outline</i>'+'</button>'+
										'<button class="btn btn-outline-dark" id="botonDeshacer'+idProc+'" style="display:none" onclick="deshacer(this)">'+'<i class="material-icons align-middle">undo</i>'+'</button>'+
										'<button class="btn btn-outline-dark" id="botonAceptar'+idProc+'" style="display:none" onclick="aceptarEd()">'+'<i class="material-icons align-middle">done_outline</i>'+'</button>'+
										'<button class="btn btn-outline-dark" id="botonCancelar'+idProc+'" style="display:none" onclick="cancelarEd()">'+'<i class="material-icons align-middle">close</i>'+'</button>'+
									'</td>'+
							'</tr>'
			$('#tabla-procesos tbody').append(htmlTags);
		}
		//Se indica que se están ingresando los datos del nuevo proceso
		cargando = true;
		
	} else {
		mostrarMensaje("alertaCargaDeTrabajo", "Primero termine la operación pendiente.");
		}
}

var tamMax = 0; //Variable para almacenar el tamaño de la partición más grande definida en las condiciones iniciales

function obtenerTamMax() {
	//Aquí se obtiene el tamaño de la partición más grande (tamMax)
	//Será utilizada para controlar que el tamaño del proceso no sea mayor al tamaño de la partición más grande
	for (i = 0; i < condicionesInciales.tablaParticiones.length; i++) {
		if (condicionesInciales.tablaParticiones[i].tamaño > tamMax) {
			tamMax = condicionesInciales.tablaParticiones[i].tamaño;
		}
	}
}

function nuevaLista() {

	//Primero se obtiene el tamaño de la partición más grande (tamMax)
	obtenerTamMax();
	
	//Si no se cargaron las particiones en las condiciones iniciales
	if (tamMax == 0) {
		mostrarMensaje("errorCargaDeTrabajo", "Primero cargue las particiones en las condiciones iniciales.");
	
	} else {
		//Se ocultan los botones "Nueva Lista" y "Listas Almacenadas" para luego cargar una nueva lista de procesos
		document.getElementById("botonNuevaLista").style.display = "none";
		document.getElementById("botonCargarLista").style.display = "none";
		
		//Se crea el encabezado de la tabla donde se cargaran los procesos
		var htmlTags = '<thead class="text-white">'+
								'<tr>'+
									'<th scope="col" id="idProc">Id</th>'+
									'<th scope="col" id="tamProc">Tamaño</th>'+
									'<th scope="col" id="prioProc">Prioridad</th>'+
									'<th scope="col" id="tArrProc">Tiempo de Arribo</th>'+
									'<th scope="col" id="cvProc">Ciclo de Vida</th>'+
									'<th scope="col" id="opciones">Opciones</th>'+
								'</tr>'+
						'</thead>'+
						'<tbody>'+
						'</tbody>'
		$('#tabla-procesos').append(htmlTags)
		
		//Se genera fila, correspondiente al primer proceso, para luego cargar sus datos
		generarFila();
		
		//Se agrega el botón para añadir nuevo proceso, el botón para guardar la lista de procesos, y el botón Siguiente
		htmlTags = '<button type="button" class="btn btn-secondary" id="botonNuevoProceso" onclick="generarFila()">Nuevo Proceso</button>'+
				   '<button type="button" class="btn btn-secondary btnNext" id="botonGuardarLista" onclick="guardarEnDB()">Guardar en DB</button>'+
				   '<button type="button" class="btn btn-secondary btnNext" id="botonContinuarSinGuardar" onclick="continuarProcesos()">Siguiente</button>'
		$('#botonesCargaDeTrabajo').append(htmlTags);
	}
}

var caracter = "-"; //Caracter de separación del ciclo de vida
var esValido; //Variable booleana para controlar si los datos del proceso son válidos

function validarProc(idProc) {
	//Aquí se valida que los datos de entrada del proceso sean correcto, respecto del formato y de las restricciones (Para más info Ver documentación)
	validarProc:{
		
		esValido = false; //Inicialmente los datos de entrada del proceso no son válidos hasta que se demuestre lo contrario
		
		var numeros = ["0","1","2","3","4","5","6","7","8","9"]; //Array usado para validar si los tipos de datos de entrada corresponden a números
		var i; //Índice para recorrer los arrays
		
	 //TAMAÑO DEL PROCESO
		//Se convierte a array para validarlo
		var tamProc = (document.getElementById("tamProc"+idProc).value).split(""); 
		
		//Si el campo de entrada está vacio
		if (tamProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Tamaño del Proceso. Inténtelo nuevamente.");
			break validarProc;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < tamProc.length; i++) {
			if (!(tamProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Tamaño del Proceso: Debe ingresar número entero. Inténtelo nuevamente.");
				break validarProc;
			}
		}
		//Se convierte el dato entrada en tipo de dato numérico
		tamProc = Number(document.getElementById("tamProc"+idProc).value);
		
		//Si se ingresó tamaño igual a cero
		if (tamProc == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "Tamaño del Proceso: Debe ser mayor a cero. Inténtelo nuevamente.");
			break validarProc;
		}
		//El tamaño del procesos no debe ser mayor al tamaño de la partición más grande definida en las condiciones iniciales (tamMax)
		if (tamProc > tamMax) {
			mostrarMensaje("errorCargaDeTrabajo", "Tamaño del Proceso: No debe ser mayor a "+tamMax+" (tamaño de la partición más grande definida en las condiciones iniciales). Inténtelo nuevamente.");
			break validarProc;
		}
		
	 //PRIORIDAD DEL PROCESO
		//No necesita validación, ya que la entrada está restringida en un selector de opciones (por defecto 1) 
		
	 //TIEMPO DE ARRIBO DEL PROCESO
		//Se convierte a array para validarlo
		var tArrProc = (document.getElementById("tArrProc"+idProc).value).split(""); 
        
		//Si el campo de entrada está vacio
		if (tArrProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Tiempo de Arribo. Inténtelo nuevamente.");
			break validarProc;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < tArrProc.length; i++) {
			if (!(tArrProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Tiempo de Arribo: Debe ingresar número entero. Inténtelo nuevamente.");
				break validarProc;
			}
		}
		
	 //CICLO DE VIDA DEL PROCESO
		//Se convierte a array para validarlo
		var cvProc = (document.getElementById("cvProc"+idProc).value).split("");
		
		//Si el campo de entrada está vacio
		if (cvProc.length == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "No se ingresó Ciclo de Vida. Inténtelo nuevamente.");
			break validarProc;
		}
		
		//Se valida que el formato de entrada sea el correcto: CPU-E-CPU-S-CPU. (Para más info Ver documentación) 
		i = 0;
		var cont = 1;
		while (i < cvProc.length) {
			if (cont > 5) {
			mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
			break validarProc;
			}
			if (!(cvProc[i] in numeros)) {
				mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
				break validarProc;
			} else {
				cont++;
				while ((i < cvProc.length) && (cvProc[i] in numeros)) {
					i++;
				}
			}
			if (i < cvProc.length) {
				if ((cvProc[i] != caracter) || (i == (cvProc.length-1))) {
					mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
					break validarProc;
				}
				i++;
			}
		}
		
		//Se obtiene el string de entrada
		cvProc = document.getElementById("cvProc"+idProc).value;
	 	
		//Se convierte el string de entrada del ciclo de vida en un array, donde se separa por "caracter" y elimina éste
		cvProc = cvProc.split(caracter);
		
		//Si el tamaño del array es distinto de 5 (correspondiente al número de posiciones: CPU-E-CPU-S-CPU)
		if (cvProc.length != 5) {
			mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: El formato ingresado es inválido. Inténtelo nuevamente. Formato de entrada: CPU-E-CPU-S-CPU");
			break validarProc;
		}
		
		//Para validar las Restricciones acerca del ciclo de vida. (Para más info Ver documentación)
		//Se convierte los valores del array a tipo numérico
		for (i=0; i<cvProc.length; i++){
			cvProc[i] = Number(cvProc[i]);
		}
		
	 //Luego se validan las restricciones
		if (cvProc[0] == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: La primer ráfaga de CPU no puede ser cero, ya que está ejecuta la instrucción de inicio. Inténtelo nuevamente.");
			break validarProc;
		}
		
		var band = false; //Variable booleana para saber si se produjo una entrada/salida
		i = 1;
		while (i < cvProc.length) {
			if (i % 2 != 0) {
				if (cvProc[i] != 0) {
					band = true;
				}
			} else {
				if ((band == true) && (cvProc[i] == 0)) {
					mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: La ráfaga de CPU inmediatamente siguiente al uso de E o S no puede ser cero. Inténtelo nuevamente.");
					break validarProc; 
				} else {
					if ((band == false) && (cvProc[i] != 0)) {
						mostrarMensaje("errorCargaDeTrabajo", "Ciclo de Vida: Si la E o S es cero, la ráfaga de CPU inmediatamente siguiente también debe ser cero. Inténtelo nuevamente.");
						break validarProc;
					}
				else {
						band = false;
					}
				}
			}
			i++;
		}
		
		//El proceso pasó todas las validaciones
		esValido = true;
		
		//Se bloquea la edición de los datos del proceso anteriormente ingresados
		document.getElementById("tamProc"+idProc).disabled = true;
		document.getElementById("prioProc"+idProc).disabled = true;
		document.getElementById("tArrProc"+idProc).disabled = true;
		document.getElementById("cvProc"+idProc).disabled = true;
		
		//Se habilita los botones para editar los datos o eliminar el proceso anteriormente ingresado
		document.getElementById("botonEditar"+idProc).style.display = "block";
		document.getElementById("botonEliminar"+idProc).style.display = "block";
	}
}

function guardarProc() {
	
	//Se validan los datos del proceso
	validarProc(idProc);
	
	//Si el proceso es válido
	if (esValido == true) {
		
		//Se indica que ya se terminó de ingresar los datos del nuevo proceso
		cargando = false;
		
		//Se ocultan los botones aceptar y cancelar correspondientes a la operación de guardar los datos del proceso
		document.getElementById("botonGuardar"+idProc).style.display = "none";
		document.getElementById("botonAnular"+idProc).style.display = "none";
		
		//Se indica que la carga del último proceso no fue anulada
		anulado = false;
		
		//Se incrementa la cantidad de procesos que tiene la lista
		cantProc++;
		
		//Se incrementa el número de Id que corresponde al siguiente proceso
		idProc++;

		seGuardaronLosProcesos = false;
	}
}

function anularProc() {
	
	//Se ocultan los botones aceptar y cancelar correspondientes a la operación de guardar los datos del proceso
	document.getElementById(idProc).style.display = "none";
	
	//Se indica que la carga del último proceso fue anulada
	anulado = true;
	
	//Se indica que ya no se están ingresando los datos del nuevo proceso
	cargando = false;
}

//
var fila;
var idP;

function eliminar(nodo) {
	//Se recibe elemento nodo a partir del cual se obtiene la fila correspondiente al proceso a eliminar 
	fila = (nodo.parentNode).parentNode;
	
	//Se obtiene el Id del proceso
	idP = fila.getAttribute("id");
	
	//Se obtienen las celdas que contienen los datos del proceso
	var elementos = fila.getElementsByClassName("celda");
	
	var j; //Índice para recorrer las celdas
	
	//Se ocultan las celdas
	for (j = 0; j < elementos.length; j++) {
		elementos[j].style.display = "none";
	}
	
	//Se indica que el proceso fue eliminado
	fila.getElementsByClassName("eliminado")[0].style.display = "table-cell";
	
	//Se decrementa la cantidad de procesos que tiene la lista
	cantProc--;
	
	//Se ocultan los botones de editar y eliminar
	document.getElementById("botonEditar"+idP).style.display = "none";
	document.getElementById("botonEliminar"+idP).style.display = "none";
	
	//Y se habilita el boton que deshace la eliminación
	document.getElementById("botonDeshacer"+idP).style.display = "block";

	seGuardaronLosProcesos = false;
}

function deshacer(nodo) {
	//Se recibe elemento nodo a partir del cual se obtiene la fila correspondiente al proceso eliminado que se desea recuperar
	fila = (nodo.parentNode).parentNode;
	
	//Se obtiene el Id del proceso
	idP = fila.getAttribute("id");
	
	//Se obtienen las celdas que contienen los datos del proceso
	elementos = fila.getElementsByClassName("celda");
	
	//Se recuperan las celdas
	for (j = 0; j < elementos.length; j++) {
		elementos[j].style.display = "table-cell";
	}
	
	//Se oculta el mensaje de eliminado
	fila.getElementsByClassName("eliminado")[0].style.display = "none";
	
	//Se incrementa la cantidad de procesos que tiene la lista
	cantProc++;
	
	//Se habilitan los botones de editar y eliminar
	document.getElementById("botonEditar"+idP).style.display = "block";
	document.getElementById("botonEliminar"+idP).style.display = "block";
	
	//Y se oculta el boton que deshacer
	document.getElementById("botonDeshacer"+idP).style.display = "none";

	seGuardaronLosProcesos = false;
}

//Variables usadas para resguardar los datos de un proceso antes de editar
var tamP;
var prioP;
var tArrP;
var cvP;
	
function editar(nodo) {
	
	//Si no se están editando los datos de otro proceso
	if ((cargando == false) && (editando == false)) {
		
		//A partir del elemento nodo recibido se obtiene la fila correspondiente al proceso que se desea editar
		fila = (nodo.parentNode).parentNode;
		
		//Se obtiene el Id del proceso
		idP = fila.getAttribute("id");
		
		//Se resguardan los datos del proceso antes de editar
		tamP = document.getElementById("tamProc"+idP).value;
		prioP = document.getElementById("prioProc"+idP).value;
		tArrP = document.getElementById("tArrProc"+idP).value;
		cvP = document.getElementById("cvProc"+idP).value;
		
		//Luego se habilita la edición de los datos
		document.getElementById("tamProc"+idP).disabled = false;
		document.getElementById("prioProc"+idP).disabled = false;
		document.getElementById("tArrProc"+idP).disabled = false;
		document.getElementById("cvProc"+idP).disabled = false;
		
		editando = true; //Se indica que se está editando los datos de un proceso
		
		//Se ocultan los botones de editar y eliminar
		document.getElementById("botonEditar"+idP).style.display = "none";
		document.getElementById("botonEliminar"+idP).style.display = "none";
		
		//Se habilitan los botones Aceptar y Cancelar, correspondientes a la operación de Editar
		document.getElementById("botonAceptar"+idP).style.display = "block";
		document.getElementById("botonCancelar"+idP).style.display = "block";
		
	} else {
		mostrarMensaje("alertaCargaDeTrabajo", "Primero termine la operación pendiente.");
	}
}

function aceptarEd() {
	
	//Se validan los nuevos datos del proceso editado
	validarProc(idP);
	
	//Si los datos son válidos
	if (esValido == true) {
		
		//Se habilitan los botones de editar y eliminar
		document.getElementById("botonEditar"+idP).style.display = "block";
		document.getElementById("botonEliminar"+idP).style.display = "block";
		
		//Se ocultan los botones correspondientes a la operacion de Editar
		document.getElementById("botonAceptar"+idP).style.display = "none";
		document.getElementById("botonCancelar"+idP).style.display = "none";
		
		//Se indica que ya no se están editando los datos de un proceso
		editando = false;

		seGuardaronLosProcesos = false;
	}
}

function cancelarEd() {
	
	//Se vuelven a ingresar los datos anteriormente resguardados
	document.getElementById("tamProc"+idP).value = tamP;
	document.getElementById("prioProc"+idP).value = prioP;
	document.getElementById("tArrProc"+idP).value = tArrP;
	document.getElementById("cvProc"+idP).value = cvP;
	
	//Y luego se deshabilita la edición de los datos
	document.getElementById("tamProc"+idP).disabled = true;
	document.getElementById("prioProc"+idP).disabled = true;
	document.getElementById("tArrProc"+idP).disabled = true;
	document.getElementById("cvProc"+idP).disabled = true;
	
	//Se habilitan los botones editar y eliminar
	document.getElementById("botonEditar"+idP).style.display = "block";
	document.getElementById("botonEliminar"+idP).style.display = "block";
	
	//Se ocultan los botones correspondientes a la operacion de Editar
	document.getElementById("botonAceptar"+idP).style.display = "none";
	document.getElementById("botonCancelar"+idP).style.display = "none";
	
	//Se indica que ya no se están editando los datos de un proceso
	editando = false;
}

var tablaProcesos = []; //Array de la nueva lista de procesos a almacenar

function obtenerLista() {
	//La lista de procesos quedará almacenada en el array "tablaProcesos"
	
	//Estructura del object donde se almacenará los datos de un proceso
		var proceso = {
				idProceso: 0,
				tamaño: 0,
				prioridad: 0,
				tiempoArribo: 0,
				cicloVida: 0,
				condicion: 0,
			};
		
		var i = 1; //Índice para recorrer toda la lista, proceso a proceso
		
		while (i < idProc) { 
		
		 //Si el proceso no fue eliminado
			if (((document.getElementById("eliminado"+i)).style.display) == ('none')) {
				
			 //Se obtienen los datos del proceso en tipo numérico
				tamP = Number(document.getElementById("tamProc"+i).value);
				prioP = Number(document.getElementById("prioProc"+i).value);
				tArrP = Number(document.getElementById("tArrProc"+i).value);
				
			 //Y para el ciclo de vida...
				//Se obtiene el string de entrada
				cvP = document.getElementById("cvProc"+i).value;
				
				//Se convierte el string de entrada del ciclo de vida en un array
				cvP = cvP.split(caracter);
				
				//Se convierte los valores del array a tipo numérico
				var j;
				for (j=0; j<cvP.length; j++){
					cvP[j] = Number(cvP[j]);
				}
				
			 //Se almacenan los datos del proceso en un object
				proceso = {
					idProceso: i,
					tamaño: tamP,
					prioridad: prioP,
					tiempoArribo: tArrP,
					cicloVida: cvP,
				};
				
			 //Se agrega el proceso al array de la lista de procesos (tablaProcesos)
				tablaProcesos.push(proceso);
				
				//Se ocultan todos los botones de opciones correspondientes al proceso
				 //document.getElementById("opciones"+i).style.display = "none";
				
			}// else {
				//Se oculta la fila completa correspondiente al proceso eliminado 
				//document.getElementById(i).style.display = "none";
				//}
			i++;
		}
		
		//Se oculta el encabezado de la tabla correspondiente a la columna Opciones
		//document.getElementById("opciones").style.display = "none";
		
		//Se ocultan los botones "Nuevo Proceso", "Guardar Lista y Continuar" y "Continuar sin Guardar"
		//document.getElementById("botonNuevoProceso").style.display = "none";
		//document.getElementById("botonGuardarLista").style.display = "none";
		//document.getElementById("botonContinuarSinGuardar").style.display = "none";
		
}

function continuarProcesos() {
	tablaProcesos = [];
	obtenerLista();
	//Se continuará pero no se almacenará la lista de procesos en DB
	continuarSinGuardar:{
		
		//Si ya se está cargando o editando un proceso no se continúa
		if ((cargando == true) || (editando == true)) {
			mostrarMensaje("alertaCargaDeTrabajo", "Primero termine la operación pendiente.");
			break continuarSinGuardar;
		}
		
		//Si la lista está vacia
		if (cantProc == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "La lista está vacia. Primero agregue procesos.");
			break continuarSinGuardar;
		}		
	}
	if (seGuardaronLosProcesos) {
		$('a[href="#algmn"]').trigger("click"); // cambia a la pestaña colas multinivel
	}
	else {
		$("#modalContinuar").modal();
	}
}

// esta cosa es porque si lo meto en el atributo onclick de un boton no anda un carajo
function continuarProcesosSinGuardar() {
    $('a[href="#algmn"]').trigger("click"); // cambia a la pestaña colas multinivel
}

function guardarEnDB() {
	
	//Si ya se está cargando o editando un proceso no se continúa
	if ((cargando == true) || (editando == true)) {
		mostrarMensaje("alertaCargaDeTrabajo", "Primero termine la operación pendiente.");
	} else {		
		//Si la lista está vacia
		if (cantProc == 0) {
			mostrarMensaje("errorCargaDeTrabajo", "La lista está vacia. Primero agregue procesos.");
		} else {
			//Se solicita el ingreso del nombre de la lista a guardar
			$("#guardarLista").modal();
			
			//
			
		}
	}
}

// carga una lista con los nombres de todas las listas de procesos guardadas
// y abre el modal para poder seleccionar
// con info de https://www.w3schools.com/jsref/met_select_remove.asp
// y de https://www.w3schools.com/jsref/met_select_add.asp
function modalCargarProcesos() {
    var stringDeConsulta = "SELECT nombre FROM Simulador.dbo.Procesos;"; // crea el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
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