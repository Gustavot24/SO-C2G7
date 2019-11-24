// Pestaña de resultados

// variables globales
var tiempoSimulacion = -1; // tiempo actual de la simulacion
var recursoCPU = { // proceso que esta en cpu
    proceso: null,
    inicioRafaga: null,
    finRafaga: null,
};
var recursoE = { // proceso que esta en entrada
    proceso: null,
    inicioRafaga: null,
    finRafaga: null,
}
var recursoS = { // proceso que esta en salida
    proceso: null,
    inicioRafaga: null,
    finRafaga: null,
}
var finDeQuantum = -1; // instante en que termina el quantum y el proceso raja de la cpu
var colaNuevos = []; // cola de nuevos
var colaListos1 = []; // cola de listos con prioridad 1
var colaListos2 = null; // cola de listos con prioridad 2 (puede que no se use)
var colaListos3 = null; // cola de listos con prioridad 3 (puede que no se use)
var colaBloqueadosE = []; // cola de bloqueados que van a la entrada
var colaBloqueadosS = []; // cola de bloqueados que van a la salida
var colaTerminados = []; // cola de terminados

// arranca la simulacion
function iniciarSimulacion() {
    document.getElementById("previous").disabled = false; // habilita el boton de anterior
    document.getElementById("next").disabled = false; // habilita el boton de siguiente
    document.getElementById("iniciar").disabled = true; // deshabilita el boton de iniciar
    colaListos1 = colasMultinivel[0]; // asigna a colaListos1 la primer cola multinivel
    if (colasMultinivel.length > 1) { // si hay una 2º cola multinivel
        colaListos2 = colasMultinivel[1]; // la asigna a colaListos2
        if (colasMultinivel.length == 3) { // si hay una 3º cola multinivel
            colaListos3 = colasMultinivel[2]; // la asigna a colaListos3
        }
        else { // si no hay 3º cola multinivel
            colaListos3 = colaListos1; // colaListos3 apunta a colaListos1
        }
    }
    else { // si no hay 2º ni 3º cola multinivel
        colaListos2 = colaListos1; // colaListos2 apunta a colaListos1
        colaListos3 = colaListos1; // colaListos3 apunta a colaListos1
    }
    cosoQueSeEjecutaCadaSegundo();
}

// esta funcion se ejecuta una vez por segundo
function cosoQueSeEjecutaCadaSegundo() {
    tiempoSimulacion++; // incrementa en uno el tiempo actual
    document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: " + tiempoSimulacion; // muestra en el html
    console.log("TIEMPO " + tiempoSimulacion); // muestra por consola

    for (var i = 0; i < tablaProcesos.length; i++) { // carga los procesos que arriban en la cola de nuevos
        if (tablaProcesos[i].tiempoArribo == tiempoSimulacion) { // si el tiempo actual coincide con el tiempo de arribo del proceso
            colaNuevos.push(tablaProcesos[i]); // lo mete en la cola de nuevos
        }
    }

    // cargar los procesos de la cola de nuevos en memoria

    if (recursoCPU.proceso === null) { // se ejecuta cuando la cpu esta vacia
        if (colaListos1.length > 0) { // si la cola de listos 1 tiene procesos busca ahi uno para despachar
            switch (colaListos1.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                case "FCFS":
                    FCFS(colaListos1);
                    break;
                case "SJF":
                    SJF(colaListos1);
                    break;
                case "SRTF":
                    SRTF(colaListos1);
                    break;
                case "Round Robin":
                    roundRobin(colaListos1);
                    break;
                case "Por Prioridad":
                    porPrioridad(colaListos1);
                    break;
            }
        }
        else if (colaListos2.length > 0) { // si la cola de listos 2 tiene procesos busca ahi uno para despachar
            switch (colaListos2.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                case "FCFS":
                    FCFS(colaListos2);
                    break;
                case "SJF":
                    SJF(colaListos2);
                    break;
                case "SRTF":
                    SRTF(colaListos2);
                    break;
                case "Round Robin":
                    roundRobin(colaListos2);
                    break;
                case "Por Prioridad":
                    porPrioridad(colaListos2);
                    break;
            }
        }
        else if (colaListos3.length > 0) { // si la cola de listos 3 tiene procesos busca ahi uno para despachar
            switch (colaListos3.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                case "FCFS":
                    FCFS(colaListos3);
                    break;
                case "SJF":
                    SJF(colaListos3);
                    break;
                case "SRTF":
                    SRTF(colaListos3);
                    break;
                case "Round Robin":
                    roundRobin(colaListos3);
                    break;
                case "Por Prioridad":
                    porPrioridad(colaListos3);
                    break;
            }
        }
        else { // si ninguna cola de listos tiene procesos, la cpu queda ociosa
            console.log("CPU continúa ocioso");
        }
    }

    if (recursoCPU.proceso !== null) { // se ejecuta cuando la cpu esta llena
        if (recursoCPU.finRafaga == tiempoSimulacion) { // el proceso tiene que salir de la cpu (si se bloquea por e/s o termina)
            //poner a 0 su ciclo de vida
            if (recursoCPU.proceso.ciclovida[1] > 0) { // el proceso tiene que ir a la entrada
                colaBloqueadosE.push(recursoCPU.proceso); // lo mete en la cola de bloqueados de entrada
                console.log("Proceso " + recursoCPU.proceso.idProceso + " se bloquea para ocupar E");
            }
            else if (recursoCPU.proceso.cicloVida[3] > 0) { // el proceso tiene que ir a la salida
                colaBloqueadosS.push(recursoCPU.proceso) // lo mete en la cola de bloqueados de salida
                console.log("Proceso " + recursoCPU.proceso.idProceso + " se bloquea para ocupar S");
            }
            else { // el proceso termina
                colaTerminados.push(recursoCPU.proceso);
                console.log("Proceso " + recursoCPU.proceso.idProceso + " termina");
            }
            recursoCPU.proceso = null;
            recursoCPU.inicioRafaga = tiempoSimulacion;
            //cargar un nuevo proceso    
        }
        else { // el proceso sigue en la cpu
            if (recursoCPU.proceso.clicloVida[0] > 0) { // esta ejecutando su primera rafaga de cpu
                recursoCPU.proceso.cicloVida[0]--; // disminuye en 1 su ciclo de vida
            }
            else if (recursoCPU.proceso.clicloVida[2] > 0) { // esta ejecutando su segunda rafaga de cpu
                recursoCPU.proceso.cicloVida[2]--; // disminuye en 1 su ciclo de vida
            }
            else if (recursoCPU.proceso.clicloVida[4] > 0) { // esta ejecutando su tercera rafaga de cpu
                recursoCPU.proceso.cicloVida[4]--; // disminuye en 1 su ciclo de vida
            }
            console.log("Proceso " + recursoCPU.proceso.idProceso + " continúa en CPU"); // muestra por consola
        }
    }

    if (recursoE.proceso === null) { // se ejecuta cuando la e/s esta vacia
        if (colaBloqueadosE.length > 0) { // si hay procesos en cola de bloqueados
            recursoE.finRafaga = tiempoSimulacion; // asigna al fin de rafaga (ocioso) el tiempo actual
            // MOSTRAR EN EL GRAFICO // se muestra en el grafico el tiempo que estuvo ocioso
            recursoE.proceso = colaBloqueadosE[0]; // asigna el primer proceso de la cola a la e/s
            recursoE.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
            recursoE.finRafaga = tiempoSimulacion + recursoE.proceso.cicloVida[1]; // asigna el tiempo de fin de la rafaga
            colaBloqueados.shift(); // elimina ese proceso de la cola de bloqueados
            agregarGanttE(recursoE.proceso.idProceso, recursoE.inicioRafaga, recursoE.finRafaga); // se muestra en el grafico el tiempo que va a estar el proceso
            document.getElementById("usoDeE").innerHTML = "P" + recursoE.proceso.idProceso;
            console.log("Proceso " + recursoE.idProceso + " ingresó a E"); // muestra por consola
        }
        else { // si no hay procesos en cola de bloqueados
            console.log("E continúa ocioso"); // muestra por consola
        }
    }

    if (recursoE.proceso !== null) { // se ejecuta cuando la e/s esta llena
        if (recursoE.finRafaga == tiempoSimulacion) { // si el fin de rafaga es igual al tiempo actual, el proceso sale de la entrada
            recursoE.proceso.cicloVida[1] = 0;
            switch (recursoE.proceso.prioridad) { // coloca el proceso en la cola de listos correspondiente a su prioridad
                case 1:
                    colaListos1.procesos.push(recursoE.proceso);
                    break;
                case 2:
                    colaListos2.procesos.push(recursoE.proceso);
                    break;
                case 3:
                    colaListos3.procesos.push(recursoE.proceso);
                    break;
            }
            console.log("Proceso " + recursoE.proceso.idProceso + " salió de E"); // muestra por consola
            recursoE.proceso = null; // se saca al proceso de la entrada
            recursoE.inicioRafaga = tiempoSimulacion; // se asigna al inicio de rafaga el tiempo actual
            if (colaBloqueadosE.length > 0) { // mira si hay procesos que quieren entrar en la entrada
                recursoE.proceso = colaBloqueadosE[0]; // asigna el primer proceso de la cola a la e/s
                recursoE.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
                recursoE.finRafaga = tiempoSimulacion + recursoE.proceso.cicloVida[1]; // asigna el tiempo de fin de la rafaga
                colaBloqueadosE.shift(); // elimina ese proceso de la cola de bloqueados
                agregarGanttE(recursoE.proceso.idProceso, recursoE.inicioRafaga, recursoE.finRafaga); // se muestra en el grafico el tiempo que va a estar el proceso
                document.getElementById("usoDeE").innerHTML = "P" + recursoE.proceso.idProceso; // muestra en el html
                console.log("Proceso " + recursoE.idProceso + " ingresó a E"); // muestra por consola    
            }
            else { // sino la entrada va a quedar ociosa por no se cuanto tiempo
                recursoE.finRafaga = null; // se deja el fin de rafaga como null (no se cuando va a dejar de estar ocioso)
                document.getElementById("usoDeE").innerHTML = "Libre"; // muestra en el html
                console.log("E quedará ocioso"); // muestra por consola
            }
        }
        else { // sino, el proceso sigue ahi
            console.log("Proceso " + recursoE.idProceso + " continúa en E"); // muestra por consola
        }
    }

    console.log(colaNuevos);
    console.log(colaListos1);
    console.log(colaListos2);
    console.log(colaListos3);
    console.log(colaBloqueadosE);
    console.log(colaBloqueadosS);
    console.log(colaTerminados);

    if (colaTerminados.length == tablaProcesos.length) { // esto quiere decir que terminaron todos los procesos, entonces tiene que terminar la simulacion
        document.getElementById("next").disabled = true; // deshabilita el boton de siguiente
        console.log("Fin de la simulación");
        alert("Fin de la simulación");
    }
}

// algoritmo fcfs
function FCFS(cola) {
    var procesoADespachar = null; // proceso que se va a despachar a cpu
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        procesoADespachar = cola[0]; // elige el primer proceso de la cola
        cola.shift(); // elimina ese proceso de la cola
    }
    recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
    recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
    if (recursoCPU.proceso.clicloVida[0] > 0) { // debe ejecutar su primera rafaga de cpu
        recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
    }
    else if (recursoCPU.proceso.clicloVida[2] > 0) { // debe ejecutar su segunda rafaga de cpu
        recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el tiempo de fin de rafaga
    }
    else if (recursoCPU.proceso.clicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
        recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el tiempo de fin de rafaga
    }
    console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
    // MOSTRAR EN EL GRAFICO // muestra en el grafico
}

// algoritmo sjf
function SJF(cola) {
    var procesoADespachar = null;
    var menorTiempo = Infinity;
    var posicionEnLaCola = 0;
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        for (var i = 0; i < cola.length; i++) {
            if (cola[i].cicloVida[0] < menorTiempo) {
                procesoADespachar = cola[i];
                menorTiempo = procesoADespachar.cicloVida[0];
                posicionEnLaCola = i;
            }
        }
        cola.splice(posicionEnLaCola, 1); // elimina el proceso a despachar de la cola de listos
        recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
        recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
        recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
        console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
        // MOSTRAR EN EL GRAFICO // muestra en el grafico
    }
}

// algoritmo srtf
function SRTF(cola) {
    var procesoADespachar = null; // proceso que se va a despachar a cpu
    var menorTiempo = Infinity; //
    var posicionEnLaCola = 0;
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        for (var i = 0; i < cola.length; i++) {
            if (cola[i].cicloVida[0] < menorTiempo) {
                procesoADespachar = cola[i];
                menorTiempo = procesoADespachar.cicloVida[0];
                posicionEnLaCola = i;
            }
        }
        if (recursoCPU.proceso !== null) { // si hay un proceso en cpu puede que sea desalojado
            if (procesoADespachar.cicloVida[0] < recursoCPU.proceso.cicloVida[0]) {
                // desalojar proceso de cpu
                // MOSTRAR GRAFICO DEL PROCESO DESALOJADO
                cola.splice(posicionEnLaCola, 1);
                recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
                recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
                console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
            }
        }
    }
    if (procesoADespachar !== null) {
    }
}

// algoritmo round robin
function roundRobin(cola) {
    //
}

// algoritmo por prioridad
function porPrioridad(cola) {
    //
}

// algoritmo first fit para particiones fijas
function firstFitFijas() {
    for (var i = 0;  i < colaNuevos.length; i++) { // itera por la cola de nuevos
        var admitido = false; // indica si un proceso fue admitido en memoria o no
        var j = 0; // para iterar sobre la tabla de particiones
        while (j < tablaParticiones.length && !admitido) { // itera por la tabla de particiones
            if ((tablaParticiones[i].tamaño >= colaNuevos[i].tamaño) && (tablaParticiones[i].estado == 0)) { // si la particion esta libre y el proceso entra
                tablaParticiones[i].estado = 1; // asigna el estado ocupado a la particion
                tablaParticiones[i].idProceso = colaNuevos[i].idProceso; // asigna el id de proceso a la particion
                tablaParticiones[i].FI = tablaParticiones[i].tamaño - colaNuevos[i].tamaño; // asigna la fragmentacion interna
                switch (colaNuevos[i].prioridad) { // segun la prioridad del proceso lo carga a su correspondiente cola de listos
                    case 1:
                        colaListos1.push(colaNuevos[i]);
                        break;
                    case 2:
                        colaListos2.push(colaNuevos[i]);
                        break;
                    case 3:
                        colaListos3.push(colaNuevos[i]);
                        break;
                }
                colaNuevos.splice(i, 1); // elimina al proceso de la cola de nuevos
                admitido = true; // indica que el proceso fue admitido para pasar al siguiente
            }
            j++; // incrementa j para pasar a la siguiente particion
        }
    }
}

// algoritmo best fit
function bestFit() {
    var mejorAjuste = -1; // indica la particion donde mejor entra el proceso
    var diferencia = Infinity; // diferencia de tamaño entre una particion y un proceso
    for (var i = 0; i < colaNuevos.length; i++) { // itera por la cola de nuevos
        for (var j = 0; j < tablaParticiones.length; j++) { // itera por la tabla de particiones
            if ((tablaParticiones[i].tamaño >= colaNuevos[i].tamaño) && (tablaParticiones[i].estado == 0)) { // si la particion esta libre y el proceso entra
                if ((tablaParticiones[j].tamaño - colaNuevos[i].tamaño) < diferencia) { // si el proceso se ajusta mejor que la diferencia guardada
                    diferencia = tablaParticiones[j].tamaño - colaNuevos[i].tamaño; // actualiza la diferencia
                    mejorAjuste = j; // guarda la posicion de esa particion
                }
            }
        }
        if (mejorAjuste >= 0) { // si es mayor o igual a 0 es porque el proceso entra en una particion
            tablaParticiones[j].estado = 1; // asigna el estado ocupado a la particion
            tablaParticiones[j].idProceso = colaNuevos[i].idProceso; // asigna el id de proceso a la particion
            tablaParticiones[j].FI = tablaParticiones[j].tamaño - colaNuevos[i].tamaño; // asigna la fragmentacion interna
            switch (colaNuevos[i].prioridad) { // segun la prioridad del proceso lo carga a su correspondiente cola de listos
                case 1:
                    colaListos1.push(colaNuevos[i]);
                    break;
                case 2:
                    colaListos2.push(colaNuevos[i]);
                    break;
                case 3:
                    colaListos3.push(colaNuevos[i]);
                    break;
            }
            colaNuevos.splice(i, 1); // elimina al proceso de la cola de nuevos
        }
    }
}

// algoritmo first fit para particiones variables
function firstFitVariables() {
    //
}

// algoritmo worst fit
function worstFit() {
    //
}

// agrega algo al diagrama de gantt de cpu
function agregarGanttCPU(proceso, inicio, fin) {
    //
}

// agrega algo al diagrama de gantt de entrada
function agregarGanttE(proceso, inicio, fin) {
    //
}

// agrega algo al diagrama de gantt de salida
function agregarGanttS(proceso, inicio, fin) {
    //
}