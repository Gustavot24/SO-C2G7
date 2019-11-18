
//En la pestaña "Algoritmo Multinivel", si la selección es "Round Robin" se habilita el ingreso para el valor del quantum
function tipoAlgoritmo(id) {
	
	var algoritmo = document.getElementById(id).value;
	
	if (algoritmo == "Round Robin") {
		document.getElementById("ingresarQuantum"+(id.slice(-1))).style.display = "block";
	} else {
		document.getElementById("ingresarQuantum"+(id.slice(-1))).style.display = "none";
	}
	
}

var quantumValido; //Variable para controlar si el valor del quantum ingresado es válido

function validarQuantum() {
	validarQuantum:{
		
		quantumValido = false;
	
		var numeros = ["0","1","2","3","4","5","6","7","8","9"]; //Array usado para validar si los tipos de datos de entrada corresponden a números
		var i; //Índice para recorrer los arrays
	
		//Se convierte a array para validarlo
		quantum = (document.getElementById("quantum"+nroDeCola).value).split("");
		
		//Si el campo de entrada está vacio
		if (quantum.length == 0) {
			mostrarMensaje("errorColasMultinivel", "¡Antes de continuar debe ingresar el Valor del Quantum!");
			break validarQuantum;
		}
		
		//Si se ingresó un tipo de dato no numérico
		for (i = 0; i < quantum.length; i++) {
			if (!(quantum[i] in numeros)) {
				mostrarMensaje("errorColasMultinivel", "¡El Valor del Quantum es incorrecto! Por favor ingrese un número entero mayor a cero.");
				break validarQuantum;
			}
		}
		//Se obtiene el dato entrada en tipo de dato numérico
		quantum = document.getElementById("quantum"+nroDeCola).value;
		
		//Si el valor del quantum ingresado es igual a cero
		if (quantum == 0) {
			mostrarMensaje("errorColasMultinivel", "¡El Valor del Quantum debe ser mayor a cero! Inténtelo nuevamente.");
			break validarQuantum;
		}
		
		quantumValido = true;
	}
}

function mostrarGrafica() {

	document.getElementById("mostrargrafica").style.display = "none";
	
	document.getElementById("mostrarGraf").style.display = "block";
	
}


//Variable que almacena el valor del quantum ingresado en la pestaña "Algoritmo Multinivel"
var quantum;

//De acuerdo al algoritmo se asigna el valor del quantum
//Si es FCFS se asigna infinito (un valor muy grande)
//Si es Round Robin se asigna el valor del quantum ingresado en la pestaña "Algoritmo Multinivel"
function iniciar() {
	
	if (nroDeCola == 1) {
	
		var algoritmo = document.getElementById("typealgm1").value;
		
		if (algoritmo == "Round Robin") {
			quantum = document.getElementById("quantum1").value;
			prepararRR();
		} else {
			if (algoritmo == "FCFS") {
				quantum = Infinity;
				prepararRR();
			} else {
				if (algoritmo == "Por Prioridad") {
					prepararPorPrioridad();
				}
			}
		}
		
	} else { //Colas Multinivel
	}
	
}

//Algoritmo Round Robin para asignación de procesos a CPU y Algoritmo FCFS para la asignación de E/S

var procesos = []; //Array para utilizar en los algoritmos

function obtenerProcesos() {
//Copia el array tablaProcesos para no modificar la lista original de procesos

	var i;
	
	var id = 0;
	var t = 0;
	var p = 0;
	var ta = 0;
	var cv = [];
	
	var proc = {
		"idProceso": 0,
		"tamaño": 0,
		"prioridad": 0,
		"tiempoArribo": 0,
		"cicloVida": [],
	};
	
	for (i = 0; i < tablaProcesos.length; i++) {
		id = tablaProcesos[i].idProceso;
		t = tablaProcesos[i].tamaño;
		p = tablaProcesos[i].prioridad;
		ta = tablaProcesos[i].tiempoArribo;
		cv = tablaProcesos[i].cicloVida.slice();
		
		proc = {
		"idProceso": id,
		"tamaño": t,
		"prioridad": p,
		"tiempoArribo": ta,
		"cicloVida": cv,
		};
		
		procesos.push(proc);
	}
}

//Variables globales
	var colaCPU = [];
	var colaE = [];
	var colaS = [];
	
	var quantumRestante;
	
	var procesosTerminados = 0;
	var tiempoActual = 0;
	
function prepararRR() {
	
	var i;
	
	obtenerProcesos();
	
	quantumRestante = quantum;
	
	//Se carga la cola de listos de CPU
	for (i = 0; i < procesos.length; i++) {
		if (procesos[i].tiempoArribo == tiempoActual) {
			procesos[i].estado = 0;
			colaCPU.push(procesos[i]);
		}
	}
	
	roundRobin(); //Se ejecuta el algoritmo (RR o FCFS)
	
	document.getElementById("iniciar").style.visibility = "hidden";
	
	var htmlTags = '<button type="button" class="btn btn-secondary" id="botonAvanzar" onclick="roundRobin()">Avanzar</button>'
	$('#botonesResultados').append(htmlTags);
}

//Algoritmo (RR o FCFS)
function roundRobin() {	
	
	var i;
	var htmlTags;
	
	//Banderas para controlar si se está haciendo uso de CPU, E y S
	var cpu = false;
	var entrada = false;
	var salida = false;

	if (procesosTerminados < procesos.length) {
		
	 //Se muestra el tiempo actual
		document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+tiempoActual;
		
	 
	 //Se limpian las colas de listos de CPU, E y S del tiempo anterior para luego mostrar las del tiempo actual
	 
	 	$("#colaDeCPU").empty();
		
		$("#colaDeE").empty();
		
		$("#colaDeS").empty();
		
	 
	 //Se muestra las colas de listos de CPU, E y S, así como los procesos que están haciendo uso de CPU, E y S en el tiempo actual
		
		if (colaCPU.length != 0) {
		
			cpu = true; //Se indica que se está haciendo uso de CPU
			
			document.getElementById("usoDeCPU").innerHTML = "P"+colaCPU[0].idProceso;
			
			if (colaCPU.length > 1) {
				
				for (i=1; i < colaCPU.length; i++) {
					htmlTags = '<div class="p-2 bg-white">P'+colaCPU[i].idProceso+'</div>'
					$('#colaDeCPU').append(htmlTags);
				}
				
			} else {
				htmlTags = '<div class="p-2 bg-white">Vacio</div>'
				$('#colaDeCPU').append(htmlTags);
			}
			
		} else {
			document.getElementById("usoDeCPU").innerHTML = "Libre";
			htmlTags = '<div class="p-2 bg-white">Vacio</div>'
			$('#colaDeCPU').append(htmlTags);
		}
	
		if (colaE.length != 0) {
		
			entrada = true; //Se indica que se está haciendo uso de E
			
			document.getElementById("usoDeE").innerHTML = "P"+colaE[0].idProceso;
			
			if (colaE.length > 1) {
				
				for (i=1; i < colaE.length; i++) {
					htmlTags = '<div class="p-2 bg-white">P'+colaE[i].idProceso+'</div>'
					$('#colaDeE').append(htmlTags);
				}
				
			} else {
				htmlTags = '<div class="p-2 bg-white">Vacio</div>'
				$('#colaDeE').append(htmlTags);
			}
			
		} else {
			document.getElementById("usoDeE").innerHTML = "Libre";
			htmlTags = '<div class="p-2 bg-white">Vacio</div>'
			$('#colaDeE').append(htmlTags);
		}
		
		if (colaS.length != 0) {
			
			salida = true; //Se indica que se está haciendo uso de S
			
			document.getElementById("usoDeS").innerHTML = "P"+colaS[0].idProceso;
			
			if (colaS.length > 1) {
				
				for (i=1; i < colaS.length; i++) {
					htmlTags = '<div class="p-2 bg-white">P'+colaS[i].idProceso+'</div>'
					$('#colaDeS').append(htmlTags);
				}
				
			} else {
				htmlTags = '<div class="p-2 bg-white">Vacio</div>'
				$('#colaDeS').append(htmlTags);
			}
			
		} else {
			document.getElementById("usoDeS").innerHTML = "Libre";
			htmlTags = '<div class="p-2 bg-white">Vacio</div>'
			$('#colaDeS').append(htmlTags);
		}
		
	 
	 //Se actualiza tiempo actual
		tiempoActual++;
		
	 //Se actualiza la cola de listos de CPU
		for (i = 0; i < procesos.length; i++) {
			if (procesos[i].tiempoArribo == tiempoActual) {
				procesos[i].estado = 0;
				colaCPU.push(procesos[i]);
			}
		}
		
	 // SE ACTUALIZA TODO LO DEMÁS!
		
		if (entrada == true) {
		
			colaE[0].cicloVida[1]--;
			
			if (colaE[0].cicloVida[1] == 0) {
				colaE[0].estado = 2;
				colaCPU.push(colaE.shift(colaE[0]));
			}
		}
	
		if (salida == true) {
			
			colaS[0].cicloVida[3]--;
			
			if (colaS[0].cicloVida[3] == 0) {
				colaS[0].estado = 4;
				colaCPU.push(colaS.shift(colaS[0]));
			}
		}
	 
		if (cpu == true) {
			
			//Se actualiza el ciclo de vida del proceso (tiempo de uso del procesador)
			colaCPU[0].cicloVida[colaCPU[0].estado]--;
			
			//Se actualiza el quantum consumido
			quantumRestante--;
			
			if ((quantumRestante == 0) || (colaCPU[0].cicloVida[colaCPU[0].estado] == 0)) {
				
				//Si el proceso no terminó de ejecutarse desaloja el procesador y vuelve a la cola de listos de CPU
				if (colaCPU[0].cicloVida[colaCPU[0].estado] > 0) {
					colaCPU.push(colaCPU.shift(colaCPU[0]));
					//console.log("Desaloja el procesador y vuelve a la cola de listos de CPU");
				} else {						
					//Si el proceso desea hacer uso de dispositivos de E, se envía el proceso a la cola de E
					if (colaCPU[0].cicloVida[1] != 0) {
						colaCPU[0].estado = 1;
						colaE.push(colaCPU.shift(colaCPU[0]));
						//console.log("Desaloja el procesador y pasa a la cola de listos de E");
					} else {
						//Si el proceso desea hacer uso de dispositivos de S, se envía el proceso a la cola de S
						if (colaCPU[0].cicloVida[3] != 0) {
							colaCPU[0].estado = 3;
							colaS.push(colaCPU.shift(colaCPU[0]));
							//console.log("Desaloja el procesador y pasa a la cola de listos de S");
						} else {
							colaCPU.shift(colaCPU[0]);
							procesosTerminados++;
							//console.log("Proceso Terminado");
						}
					}
				}
				quantumRestante = quantum;
			}
			
		}		
	
	} else { //Fin de la simulación
		
		document.getElementById("botonAvanzar").style.visibility = "hidden"; //Se oculta el botón "Avanzar"
		
		document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+tiempoActual; //Tiempo de fin
		
		document.getElementById("usoDeCPU").innerHTML = "Libre"; //La CPU queda libre
		
		var htmlTags = '<p type="text" id="mensajeDeFin">Fin de la simulación.</p>' //Mensaje de fin
		$('#botonesResultados').append(htmlTags);
	}
}


//Algoritmo por Prioridad para asignación de procesos a CPU y Algoritmo FCFS para la asignación de E/S

function ordenarPorPrioridad() {
	
	// Ordenar elementos del arreglo por una propiedad numérica.
	Array.prototype.orderByNumber = function(property,sortOrder){
		sortOrder=1;
		this.sort(function(a,b){
		// La función de ordenamiento devuelve la comparación entre property de a y b.
		// El resultado será afectado por sortOrder.
		return (a[property]-b[property])*sortOrder;
	  })
	}
	
	// Se llama a la función de ordenamiento, indicando ordenar la cola de CPU por prioridad del proceso
	// 1 indica que el ordenamiento será en ordén decreciente
	colaCPU.orderByNumber('prioridad',-1);
	
}

function prepararPorPrioridad() {
	
	var i;
	
	obtenerProcesos();
	
	//Se carga la cola de listos de CPU
	for (i = 0; i < procesos.length; i++) {
		if (procesos[i].tiempoArribo == tiempoActual) {
			procesos[i].estado = 0;
			colaCPU.push(procesos[i]);
		}
	}
	
	porPrioridad(); //Se ejecuta el algoritmo por Prioridad
	
	document.getElementById("iniciar").style.visibility = "hidden";
	
	var htmlTags = '<button type="button" class="btn btn-secondary" id="botonAvanzar" onclick="porPrioridad()">Avanzar</button>'
	$('#botonesResultados').append(htmlTags);
}

function porPrioridad() {	
//Algoritmo por Prioridad	
	var i;
	var htmlTags;
	
	//Banderas para controlar si se está haciendo uso de CPU, E y S
	var cpu = false;
	var entrada = false;
	var salida = false;

	if (procesosTerminados < procesos.length) {
		
	 //Se muestra el tiempo actual
		document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+tiempoActual;
		
	 
	 //Se limpian las colas de listos de CPU, E y S del tiempo anterior para luego mostrar las del tiempo actual
	 
	 	$("#colaDeCPU").empty();
		
		$("#colaDeE").empty();
		
		$("#colaDeS").empty();
		
	 
	 //Se muestra las colas de listos de CPU, E y S, así como los procesos que están haciendo uso de CPU, E y S en el tiempo actual
		
		if (colaCPU.length != 0) {
			
			ordenarPorPrioridad();
			
			cpu = true; //Se indica que se está haciendo uso de CPU
			
			document.getElementById("usoDeCPU").innerHTML = "P"+colaCPU[0].idProceso;
			
			if (colaCPU.length > 1) {
				
				for (i=1; i < colaCPU.length; i++) {
					htmlTags = '<div class="p-2 bg-white">P'+colaCPU[i].idProceso+'</div>'
					$('#colaDeCPU').append(htmlTags);
				}
				
			} else {
				htmlTags = '<div class="p-2 bg-white">Vacio</div>'
				$('#colaDeCPU').append(htmlTags);
			}
			
		} else {
			document.getElementById("usoDeCPU").innerHTML = "Libre";
			htmlTags = '<div class="p-2 bg-white">Vacio</div>'
			$('#colaDeCPU').append(htmlTags);
		}
	
		if (colaE.length != 0) {
		
			entrada = true; //Se indica que se está haciendo uso de E
			
			document.getElementById("usoDeE").innerHTML = "P"+colaE[0].idProceso;
			
			if (colaE.length > 1) {
				
				for (i=1; i < colaE.length; i++) {
					htmlTags = '<div class="p-2 bg-white">P'+colaE[i].idProceso+'</div>'
					$('#colaDeE').append(htmlTags);
				}
				
			} else {
				htmlTags = '<div class="p-2 bg-white">Vacio</div>'
				$('#colaDeE').append(htmlTags);
			}
			
		} else {
			document.getElementById("usoDeE").innerHTML = "Libre";
			htmlTags = '<div class="p-2 bg-white">Vacio</div>'
			$('#colaDeE').append(htmlTags);
		}
		
		if (colaS.length != 0) {
			
			salida = true; //Se indica que se está haciendo uso de S
			
			document.getElementById("usoDeS").innerHTML = "P"+colaS[0].idProceso;
			
			if (colaS.length > 1) {
				
				for (i=1; i < colaS.length; i++) {
					htmlTags = '<div class="p-2 bg-white">P'+colaS[i].idProceso+'</div>'
					$('#colaDeS').append(htmlTags);
				}
				
			} else {
				htmlTags = '<div class="p-2 bg-white">Vacio</div>'
				$('#colaDeS').append(htmlTags);
			}
			
		} else {
			document.getElementById("usoDeS").innerHTML = "Libre";
			htmlTags = '<div class="p-2 bg-white">Vacio</div>'
			$('#colaDeS').append(htmlTags);
		}
		
	 
	 //Se actualiza tiempo actual
		tiempoActual++;
		
	 //Se actualiza la cola de listos de CPU
		for (i = 0; i < procesos.length; i++) {
			if (procesos[i].tiempoArribo == tiempoActual) {
				procesos[i].estado = 0;
				colaCPU.push(procesos[i]);
			}
		}
		
	
	// SE ACTUALIZA TODO LO DEMÁS!
		
		if (entrada == true) {
		
			colaE[0].cicloVida[1]--;
			
			if (colaE[0].cicloVida[1] == 0) {
				colaE[0].estado = 2;
				colaCPU.push(colaE.shift(colaE[0]));
			}
		}
	
		if (salida == true) {
			
			colaS[0].cicloVida[3]--;
			
			if (colaS[0].cicloVida[3] == 0) {
				colaS[0].estado = 4;
				colaCPU.push(colaS.shift(colaS[0]));
			}
		}
	 
		if (cpu == true) {
			
			//Se actualiza el ciclo de vida del proceso (tiempo de uso del procesador)
			colaCPU[0].cicloVida[colaCPU[0].estado]--;
			
			
			if (colaCPU[0].cicloVida[colaCPU[0].estado] == 0) {
					
					//Si el proceso desea hacer uso de dispositivos de E, se envía el proceso a la cola de E
					if (colaCPU[0].cicloVida[1] != 0) {
						colaCPU[0].estado = 1;
						colaE.push(colaCPU.shift(colaCPU[0]));
						//console.log("Desaloja el procesador y pasa a la cola de listos de E");
					} else {
						//Si el proceso desea hacer uso de dispositivos de S, se envía el proceso a la cola de S
						if (colaCPU[0].cicloVida[3] != 0) {
							colaCPU[0].estado = 3;
							colaS.push(colaCPU.shift(colaCPU[0]));
							//console.log("Desaloja el procesador y pasa a la cola de listos de S");
						} else {
							colaCPU.shift(colaCPU[0]);
							procesosTerminados++;
							//console.log("Proceso Terminado");
						}
					}
				
			}
			
		}		
	
	} else { //Fin de la simulación
		
		document.getElementById("botonAvanzar").style.visibility = "hidden"; //Se oculta el botón "Avanzar"
		
		document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+tiempoActual; //Tiempo de fin
		
		document.getElementById("usoDeCPU").innerHTML = "Libre"; //La CPU queda libre
		
		var htmlTags = '<p type="text" id="mensajeDeFin">Fin de la simulación.</p>' //Mensaje de fin
		$('#botonesResultados').append(htmlTags);
	}
}