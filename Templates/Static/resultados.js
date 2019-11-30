import { addListener } from "cluster";

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
var finDeQuantum = false; // instante en que termina el quantum y el proceso raja de la cpu
var colaNuevos = []; // cola de nuevos
var colaListos1 = []; // cola de listos con prioridad 1
var colaListos2 = null; // cola de listos con prioridad 2 (puede que no se use)
var colaListos3 = null; // cola de listos con prioridad 3 (puede que no se use)
var colaBloqueadosE = []; // cola de bloqueados que van a la entrada
var colaBloqueadosS = []; // cola de bloqueados que van a la salida
var colaTerminados = []; // cola de terminados
var colaListos1EnElHTML; // cola de listos 1 en la pestaña resultados del html
var colaListos2EnElHTML; // cola de listos 2 en la pestaña resultados del html
var colaListos3EnElHTML; // cola de listos 3 en la pestaña resultados del html
var colaNuevosEnElHTML = document.getElementById("colaNuevo"); // cola de nuevos en la pestaña resultados del html
var colaBloqueadosEEnElHTML = document.getElementById("colaBloqueadoE"); // cola de bloqueados de entrada en la pestaña resultados del html
var colaBloqueadosSEnElHTML = document.getElementById("colaBloqueadoS"); // cola de bloqueados de salida en la pestaña resultados del html
var colaTerminadosEnElHTML = document.getElementById("colaTerminado"); // cola de terminados en la pestaña resultados del html
var tablaParticiones = condicionesInciales.tablaParticiones; // tabla de particiones

// arranca la simulacion
function iniciarSimulacion() {
    document.getElementById("previous").disabled = false; // habilita el boton de anterior
    document.getElementById("next").disabled = false; // habilita el boton de siguiente
    document.getElementById("iniciar").disabled = true; // deshabilita el boton de iniciar
    if (colasMultinivel.length == 1) { // si hay una sola cola multinivel
        colaListos1 = colasMultinivel[0]; // asigna a colaListos1 la primer cola multinivel
        colaListos2 = colaListos1; // colaListos2 apunta a colaListos1
        colaListos3 = colaListos1; // colaListos3 apunta a colaListos1
        colaListos1EnElHTML = document.getElementById("colaListo1");
        colaListos2EnElHTML = document.getElementById("colaListo1");
        colaListos3EnElHTML = document.getElementById("colaListo1");
    }
    else if (colasMultinivel.length == 2) { // si hay dos colas multinivel
        colaListos1 = colasMultinivel[0]; // asigna a colaListos1 la primer cola multinivel
        colaListos2 = colasMultinivel[1]; // asigna a colaListos2 la segunda cola multinivel
        colaListos3 = colaListos2; // colaListos3 apunta a colaListos2
        colaListos1EnElHTML = document.getElementById("colaListo1");
        colaListos2EnElHTML = document.getElementById("colaListo2");
        colaListos3EnElHTML = document.getElementById("colaListo2");
    }
    else if (colasMultinivel.length == 3) { // si hay tres colas multinivel
        colaListos1 = colasMultinivel[0]; // asigna a colaListos1 la primer cola multinivel
        colaListos2 = colasMultinivel[1]; // asigna a colaListos2 la segunda cola multinivel
        colaListos3 = colasMultinivel[2]; // asigna a colaListos3 la tercera cola multinivel
        colaListos1EnElHTML = document.getElementById("colaListo1");
        colaListos2EnElHTML = document.getElementById("colaListo2");
        colaListos3EnElHTML = document.getElementById("colaListo3");
    }
    recursoCPU.inicioRafaga = 0;
    recursoE.inicioRafaga = 0;
    recursoS.inicioRafaga = 0;
    cosoQueSeEjecutaCadaSegundo();
}

// esta funcion se ejecuta una vez por segundo (o sea, cada vez que se hace clic en el boton de avanzar)
function cosoQueSeEjecutaCadaSegundo() {
    tiempoSimulacion++; // incrementa en uno el tiempo actual
    document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: " + tiempoSimulacion; // muestra en el html
    console.log("TIEMPO " + tiempoSimulacion); // muestra por consola

    for (var i = 0; i < tablaProcesos.length; i++) { // carga los procesos que arriban en la cola de nuevos
        if (tablaProcesos[i].tiempoArribo == tiempoSimulacion) { // si el tiempo actual coincide con el tiempo de arribo del proceso
            colaNuevos.push(tablaProcesos[i]); // lo mete en la cola de nuevos
        }
    }

    switch (condicionesInciales.algoritmo) { // cargar los procesos de la cola de nuevos en memoria y cola de listos
        case "FF": // first fit para particiones fijas
            firstFitFijas();
            break;
        case "B": // best fit para particiones fijas
            bestFit();
            break;
        case "FV": // first fit para particiones variables
            firstFitVariables();
            break;
        case "W": // worst fit para particiones variables
            worstFit();
            break;
    }

    if (recursoCPU.proceso === null) { // se ejecuta cuando la cpu esta vacia
        if (colaListos1.procesos.length > 0) { // si la cola de listos 1 tiene procesos busca ahi uno para despachar
            switch (colaListos1.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                case "FCFS":
                    FCFS(colaListos1.procesos);
                    break;
                case "SJF":
                    SJF(colaListos1.procesos);
                    break;
                case "SRTF":
                    SRTF(colaListos1.procesos);
                    break;
                case "Round Robin":
                    roundRobin(colaListos1.procesos, colaListos1.quantum);
                    break;
                case "Por Prioridad":
                    porPrioridad(colaListos1.procesos);
                    break;
            }
        }
        else if (colaListos2.procesos.length > 0) { // si la cola de listos 2 tiene procesos busca ahi uno para despachar
            switch (colaListos2.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                case "FCFS":
                    FCFS(colaListos2.procesos);
                    break;
                case "SJF":
                    SJF(colaListos2.procesos);
                    break;
                case "SRTF":
                    SRTF(colaListos2.procesos);
                    break;
                case "Round Robin":
                    roundRobin(colaListos2.procesos, colaListos2.quantum);
                    break;
                case "Por Prioridad":
                    porPrioridad(colaListos2.procesos);
                    break;
            }
        }
        else if (colaListos3.procesos.length > 0) { // si la cola de listos 3 tiene procesos busca ahi uno para despachar
            switch (colaListos3.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                case "FCFS":
                    FCFS(colaListos3.procesos);
                    break;
                case "SJF":
                    SJF(colaListos3.procesos);
                    break;
                case "SRTF":
                    SRTF(colaListos3.procesos);
                    break;
                case "Round Robin":
                    roundRobin(colaListos3.procesos, colaListos3.quantum);
                    break;
                case "Por Prioridad":
                    porPrioridad(colaListos3.procesos);
                    break;
            }
        }
        else { // si ninguna cola de listos tiene procesos, la cpu queda ociosa
            console.log("CPU continúa ocioso");
        }
    }

    if (recursoCPU.proceso !== null) { // se ejecuta cuando la cpu esta llena
        if (recursoCPU.finRafaga == tiempoSimulacion) { // el proceso tiene que salir de la cpu (si se bloquea por e/s o termina)
            agregarGanttCPU(recursoCPU.proceso.idProceso, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // muestra en el html
            if (finDeQuantum) { // si el proceso tiene que salir porque termino su quantum
                switch (recursoCPU.proceso.prioridad) { // segun la prioridad del proceso lo devuelve a su correspondiente cola de listos
                    case 1:
                        colaListos1.procesos.push(recursoCPU.proceso);
                        break;
                    case 2:
                        colaListos2.procesos.push(recursoCPU.proceso);
                        break;
                    case 3:
                        colaListos3.procesos.push(recursoCPU.proceso);
                        break;
                }
                finDeQuantum = false; // pone a false para no cometer errores en la proxima ejecucion
                console.log("Proceso " + recursoCPU.proceso.idProceso + " desalojado de CPU porque finalizó su quantum"); // muestra por consola
            }
            else { // sino, el proceso se bloquea o termina
                if (recursoCPU.proceso.cicloVida[1] > 0) { // el proceso tiene que ir a la entrada
                    colaBloqueadosE.push(recursoCPU.proceso); // lo mete en la cola de bloqueados de entrada
                    console.log("Proceso " + recursoCPU.proceso.idProceso + " se bloquea para ocupar E"); // muestra por consola
                }
                else if (recursoCPU.proceso.cicloVida[3] > 0) { // el proceso tiene que ir a la salida
                    colaBloqueadosS.push(recursoCPU.proceso) // lo mete en la cola de bloqueados de salida
                    console.log("Proceso " + recursoCPU.proceso.idProceso + " se bloquea para ocupar S"); // muestra por consola
                }
                else { // el proceso termina
                    colaTerminados.push(recursoCPU.proceso); // coloca el proceso en la cola de terminados
                    for (var i = 0; i < tablaParticiones.length; i++) { // elimina el proceso de memoria
                        if (tablaParticiones[i].idProceso == recursoCPU.proceso.idProceso) {
                            tablaParticiones[i].idProceso = null;
                            tablaParticiones[i].estado = 0;
                            tablaParticiones[i].FI = 0;
                        }
                    }
                    console.log("Proceso " + recursoCPU.proceso.idProceso + " termina"); // muestra por consola
                }
            }
            recursoCPU.proceso = null; // elimina el proceso de la cpu
            document.getElementById("usoDeCPU").innerHTML = "Libre";
            recursoCPU.inicioRafaga = tiempoSimulacion; // pone el inicio de rafaga igual al tiempo actual
            // ahora se fija si hay un proceso que pueda ser cargado
            if (colaListos1.procesos.length > 0) { // si la cola de listos 1 tiene procesos busca ahi uno para despachar
                switch (colaListos1.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                    case "FCFS":
                        FCFS(colaListos1.procesos);
                        break;
                    case "SJF":
                        SJF(colaListos1.procesos);
                        break;
                    case "SRTF":
                        SRTF(colaListos1.procesos);
                        break;
                    case "Round Robin":
                        roundRobin(colaListos1.procesos, colaListos1.quantum);
                        break;
                    case "Por Prioridad":
                        porPrioridad(colaListos1.procesos);
                        break;
                }
            }
            else if (colaListos2.procesos.length > 0) { // si la cola de listos 2 tiene procesos busca ahi uno para despachar
                switch (colaListos2.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                    case "FCFS":
                        FCFS(colaListos2.procesos);
                        break;
                    case "SJF":
                        SJF(colaListos2.procesos);
                        break;
                    case "SRTF":
                        SRTF(colaListos2.procesos);
                        break;
                    case "Round Robin":
                        roundRobin(colaListos2.procesos, colaListos2.quantum);
                        break;
                    case "Por Prioridad":
                        porPrioridad(colaListos2.procesos);
                        break;
                }
            }
            else if (colaListos3.procesos.length > 0) { // si la cola de listos 3 tiene procesos busca ahi uno para despachar
                switch (colaListos3.algoritmo) { // dependiendo del algoritmo de la cola ejecuta la funcion del algoritmo
                    case "FCFS":
                        FCFS(colaListos3.procesos);
                        break;
                    case "SJF":
                        SJF(colaListos3.procesos);
                        break;
                    case "SRTF":
                        SRTF(colaListos3.procesos);
                        break;
                    case "Round Robin":
                        roundRobin(colaListos3.procesos, colaListos3.quantum);
                        break;
                    case "Por Prioridad":
                        porPrioridad(colaListos3.procesos);
                        break;
                }
            }
            else { // si ninguna cola de listos tiene procesos, la cpu queda ociosa
                console.log("CPU quedará ocioso");
            }
        }
        else { // el proceso puede seguir en la cpu (si no es desalojado por srtf)
            if (recursoCPU.proceso.cicloVida[0] > 0) { // esta ejecutando su primera rafaga de cpu
                recursoCPU.proceso.cicloVida[0]--; // disminuye en 1 su ciclo de vida
            }
            else if (recursoCPU.proceso.cicloVida[2] > 0) { // esta ejecutando su segunda rafaga de cpu
                recursoCPU.proceso.cicloVida[2]--; // disminuye en 1 su ciclo de vida
            }
            else if (recursoCPU.proceso.cicloVida[4] > 0) { // esta ejecutando su tercera rafaga de cpu
                recursoCPU.proceso.cicloVida[4]--; // disminuye en 1 su ciclo de vida
            }
            if (colaListos1.algoritmo == "SRTF") { // si el algoritmo de la cola de listos 1 es srtf tiene que ejecutarlo
                SRTF(colaListos1.procesos); // porque puede que se desaloje el proceso de cpu
            }
            else if (colaListos1.length == 0 && colaListos2.algoritmo == "SRTF") { // si la cola 1 esta vacia y la cola 2 es srtf
                SRTF(colaListos2.procesos); // tiene que buscar en la cola 2 para desalojar
            }
            else if (colaListos1.length == 0 && colaListos2.length == 0 && colaListos3.algoritmo == "SRTF") { // si las colas 1 y 2 estan vacias y la cola 3 es srtf
                SRTF(colaListos3.procesos); // tiene que buscar en la cola 3 para desalojar
            }
            console.log("Proceso " + recursoCPU.proceso.idProceso + " continúa en CPU"); // muestra por consola
        }
    }

    if (recursoE.proceso === null) { // se ejecuta cuando la entrada esta vacia
        if (colaBloqueadosE.length > 0) { // si hay procesos en cola de bloqueados
            recursoE.finRafaga = tiempoSimulacion; // asigna al fin de rafaga (ocioso) el tiempo actual
            agregarGanttE(null, recursoE.inicioRafaga, recursoE.finRafaga); // se muestra en el grafico el tiempo que estuvo ocioso
            recursoE.proceso = colaBloqueadosE[0]; // asigna el primer proceso de la cola a la entrada
            recursoE.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
            recursoE.finRafaga = tiempoSimulacion + recursoE.proceso.cicloVida[1]; // asigna el tiempo de fin de la rafaga
            colaBloqueadosE.shift(); // elimina ese proceso de la cola de bloqueados
            agregarGanttE(recursoE.proceso.idProceso, recursoE.inicioRafaga, recursoE.finRafaga); // se muestra en el grafico el tiempo que va a estar el proceso
            document.getElementById("usoDeE").innerHTML = "P" + recursoE.proceso.idProceso;
            console.log("Proceso " + recursoE.proceso.idProceso + " ingresó a E"); // muestra por consola
        }
        else { // si no hay procesos en cola de bloqueados
            console.log("E continúa ocioso"); // muestra por consola
        }
    }

    if (recursoE.proceso !== null) { // se ejecuta cuando la entrada esta llena
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
                recursoE.proceso = colaBloqueadosE[0]; // asigna el primer proceso de la cola a la entrada
                recursoE.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
                recursoE.finRafaga = tiempoSimulacion + recursoE.proceso.cicloVida[1]; // asigna el tiempo de fin de la rafaga
                colaBloqueadosE.shift(); // elimina ese proceso de la cola de bloqueados
                agregarGanttE(recursoE.proceso.idProceso, recursoE.inicioRafaga, recursoE.finRafaga); // se muestra en el grafico el tiempo que va a estar el proceso
                document.getElementById("usoDeE").innerHTML = "P" + recursoE.proceso.idProceso; // muestra en el html
                console.log("Proceso " + recursoE.proceso.idProceso + " ingresó a E"); // muestra por consola    
            }
            else { // sino la entrada va a quedar ociosa por no se cuanto tiempo
                recursoE.finRafaga = null; // se deja el fin de rafaga como null (no se cuando va a dejar de estar ocioso)
                document.getElementById("usoDeE").innerHTML = "Libre"; // muestra en el html
                console.log("E quedará ocioso"); // muestra por consola
            }
        }
        else { // sino, el proceso sigue ahi
            console.log("Proceso " + recursoE.proceso.idProceso + " continúa en E"); // muestra por consola
        }
    }

    if (recursoS.proceso === null) { // se ejecuta cuando la salida esta vacia
        if (colaBloqueadosS.length > 0) { // si hay procesos en cola de bloqueados
            recursoS.finRafaga = tiempoSimulacion; // asigna al fin de rafaga (ocioso) el tiempo actual
            agregarGanttS(null, recursoS.inicioRafaga, recursoS.finRafaga); // se muestra en el grafico el tiempo que estuvo ocioso
            recursoS.proceso = colaBloqueadosS[0]; // asigna el primer proceso de la cola a la salida
            recursoS.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
            recursoS.finRafaga = tiempoSimulacion + recursoS.proceso.cicloVida[3]; // asigna el tiempo de fin de la rafaga
            colaBloqueadosS.shift(); // elimina ese proceso de la cola de bloqueados
            agregarGanttS(recursoS.proceso.idProceso, recursoS.inicioRafaga, recursoS.finRafaga); // se muestra en el grafico el tiempo que va a estar el proceso
            document.getElementById("usoDeS").innerHTML = "P" + recursoS.proceso.idProceso;
            console.log("Proceso " + recursoS.proceso.idProceso + " ingresó a S"); // muestra por consola
        }
        else { // si no hay procesos en cola de bloqueados
            console.log("S continúa ocioso"); // muestra por consola
        }
    }

    if (recursoS.proceso !== null) { // se ejecuta cuando la salida esta llena
        if (recursoS.finRafaga == tiempoSimulacion) { // si el fin de rafaga es igual al tiempo actual, el proceso sale de la salida
            recursoS.proceso.cicloVida[3] = 0;
            switch (recursoS.proceso.prioridad) { // coloca el proceso en la cola de listos correspondiente a su prioridad
                case 1:
                    colaListos1.procesos.push(recursoS.proceso);
                    break;
                case 2:
                    colaListos2.procesos.push(recursoS.proceso);
                    break;
                case 3:
                    colaListos3.procesos.push(recursoS.proceso);
                    break;
            }
            console.log("Proceso " + recursoS.proceso.idProceso + " salió de S"); // muestra por consola
            recursoS.proceso = null; // se saca al proceso de la salida
            recursoS.inicioRafaga = tiempoSimulacion; // se asigna al inicio de rafaga el tiempo actual
            if (colaBloqueadosS.length > 0) { // mira si hay procesos que quieren entrar en la salida
                recursoS.proceso = colaBloqueadosS[0]; // asigna el primer proceso de la cola a la salida
                recursoS.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
                recursoS.finRafaga = tiempoSimulacion + recursoS.proceso.cicloVida[3]; // asigna el tiempo de fin de la rafaga
                colaBloqueadosS.shift(); // elimina ese proceso de la cola de bloqueados
                agregarGanttS(recursoS.proceso.idProceso, recursoS.inicioRafaga, recursoS.finRafaga); // se muestra en el grafico el tiempo que va a estar el proceso
                document.getElementById("usoDeS").innerHTML = "P" + recursoS.proceso.idProceso; // muestra en el html
                console.log("Proceso " + recursoS.idProceso + " ingresó a S"); // muestra por consola    
            }
            else { // sino la entrada va a quedar ociosa por no se cuanto tiempo
                recursoS.finRafaga = null; // se deja el fin de rafaga como null (no se cuando va a dejar de estar ocioso)
                document.getElementById("usoDeS").innerHTML = "Libre"; // muestra en el html
                console.log("S quedará ocioso"); // muestra por consola
            }
        }
        else { // sino, el proceso sigue ahi
            console.log("Proceso " + recursoS.proceso.idProceso + " continúa en S"); // muestra por consola
        }
    }

    colaNuevosEnElHTML.innerHTML = "";
    colaListos1EnElHTML.innerHTML = "";
    colaListos2EnElHTML.innerHTML = "";
    colaListos3EnElHTML.innerHTML = "";
    colaBloqueadosEEnElHTML.innerHTML = "";
    colaBloqueadosSEnElHTML.innerHTML = "";
    colaTerminadosEnElHTML.innerHTML = "";

    if (colaNuevos.length == 0) { // si la cola de nuevos esta vacia
        colaNuevosEnElHTML.innerHTML = 
            '<div class="p-2 bg-white" id="CNVacio">' +
            'Vacío' +
            '</div>'; // carga un div que dice vacio
    }
    else { // sino, carga los procesos en la cola
        for (var i = 0; i < colaNuevos.length; i++) { 
            colaNuevosEnElHTML.innerHTML +=
            '<div class="p-2 bg-white" id="CN' + colaNuevos[i].idProceso + '">' +
            colaNuevos[i].idProceso +
            '</div>'; // carga un div con el proceso
        }
    }

    if (colaListos1.procesos.length == 0) { // si la cola de listos 1 esta vacia
        colaListos1EnElHTML.innerHTML = 
        '<div class="p-2 bg-white" id="CL1Vacio">' +
        'Vacío' +
        '</div>'; // carga un div que dice vacio
    }
    else { // sino, carga los procesos en la cola
        for (var i = 0; i < colaListos1.procesos.length; i++) { 
            colaListos1EnElHTML.innerHTML +=
            '<div class="p-2 bg-white" id="CL1' + colaListos1.procesos[i].idProceso + '">' +
            colaListos1.procesos[i].idProceso +
            '</div>'; // carga un div con el proceso
        }
    }

    if (colaListos2EnElHTML.style.display != "none") { // si se usa la cola de listos 2 se trabaja sobre ella
        if (colaListos2.procesos.length == 0) { // si la cola de listos 2 esta vacia
            colaListos2EnElHTML.innerHTML = 
            '<div class="p-2 bg-white" id="CL2Vacio">' +
            'Vacío' +
            '</div>'; // carga un div que dice vacio
        }
        else { // sino, carga los procesos en la cola
            for (var i = 0; i < colaListos2.procesos.length; i++) { 
                colaListos2EnElHTML.innerHTML +=
                '<div class="p-2 bg-white" id="CL1' + colaListos2.procesos[i].idProceso + '">' +
                colaListos2.procesos[i].idProceso +
                '</div>'; // carga un div con el proceso
            }
        }
    }

    if (colaListos3EnElHTML.style.display != "none") { // si se usa la cola de listos 3 se trabaja sobre ella
        if (colaListos3.procesos.length == 0) { // si la cola de listos 3 esta vacia
            colaListos3EnElHTML.innerHTML = 
            '<div class="p-2 bg-white" id="CL3Vacio">' +
            'Vacío' +
            '</div>'; // carga un div que dice vacio
        }
        else { // sino, carga los procesos en la cola
            for (var i = 0; i < colaListos3.procesos.length; i++) { 
                colaListos3EnElHTML.innerHTML +=
                '<div class="p-2 bg-white" id="CL1' + colaListos3.procesos[i].idProceso + '">' +
                colaListos3.procesos[i].idProceso +
                '</div>'; // carga un div con el proceso
            }
        }
    }

    if (colaBloqueadosE.length == 0) { // si la cola de bloqueados de entrada esta vacia
        colaBloqueadosEEnElHTML.innerHTML = 
            '<div class="p-2 bg-white" id="CBEVacio">' +
            'Vacío' +
            '</div>'; // carga un div que dice vacio
    }
    else { // sino, carga los procesos en la cola
        for (var i = 0; i < colaBloqueadosE.length; i++) { 
            colaBloqueadosEEnElHTML.innerHTML +=
            '<div class="p-2 bg-white" id="CBE' + colaBloqueadosE[i].idProceso + '">' +
            colaBloqueadosE[i].idProceso +
            '</div>'; // carga un div con el proceso
        }
    }

    if (colaBloqueadosS.length == 0) { // si la cola de bloqueados de salida esta vacia
        colaBloqueadosSEnElHTML.innerHTML = 
            '<div class="p-2 bg-white" id="CBSVacio">' +
            'Vacío' +
            '</div>'; // carga un div que dice vacio
    }
    else { // sino, carga los procesos en la cola
        for (var i = 0; i < colaBloqueadosS.length; i++) { 
            colaBloqueadosSEnElHTML.innerHTML +=
            '<div class="p-2 bg-white" id="CBS' + colaBloqueadosS[i].idProceso + '">' +
            colaBloqueadosS[i].idProceso +
            '</div>'; // carga un div con el proceso
        }
    }

    if (colaTerminados.length == 0) { // si la cola de terminados esta vacia
        colaTerminadosEnElHTML.innerHTML = 
            '<div class="p-2 bg-white" id="CTVacio">' +
            'Vacío' +
            '</div>'; // carga un div que dice vacio
    }
    else { // sino, carga los procesos en la cola
        for (var i = 0; i < colaTerminados.length; i++) { 
            colaTerminadosEnElHTML.innerHTML +=
            '<div class="p-2 bg-white" id="CT' + colaTerminados[i].idProceso + '">' +
            colaTerminados[i].idProceso +
            '</div>'; // carga un div con el proceso
        }
    }

    document.getElementById("divMemoria").innerHTML = 
        '<div class="p-2 bg-white">' +
        '  <a data-trigger="hover" data-placement="bottom" data-original-title="Reservado para el SO" data-toggle="popover" data-content="Dir. inicio: 0 Dir. fin: ' + (condicionesInciales.tamanoSO - 1) + ' Tamaño: ' + condicionesInciales.tamanoSO + '">Reservado para el SO</a>' +
        '</div>'; // deja el mapa de memoria solo con el SO, para agregar las particiones despues
    for (var i = 0; i < tablaParticiones.length; i++) { // dibuja el mapa de memoria con las particiones
        if (tablaParticiones[i].estado == 0) { // particion libre
            var texto =
                "Dir. inicio: " + tablaParticiones[i].dirInicio +
                " Dir. fin: " + tablaParticiones[i].dirFin +
                " Tamaño: " + tablaParticiones[i].tamaño; // crea el contenido del popover con los datos de la particion
            document.getElementById("divMemoria").innerHTML +=
                '<div class="p-2 bg-white">' +
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Partición ' + tablaParticiones[i].idParticion + '" data-toggle="popover" data-content="' + texto + '">Libre</a>' +
                '</div>'; // agrega la particion al mapa de memoria
        }
        else {
            var texto =
                "Dir. inicio: " + tablaParticiones[i].dirInicio +
                " Dir. fin: " + tablaParticiones[i].dirFin +
                " Tamaño: " + tablaParticiones[i].tamaño +
                " Frag. interna: " + tablaParticiones[i].FI; // crea el contenido del popover con los datos de la particion
            document.getElementById("divMemoria").innerHTML +=
                '<div class="p-2 bg-white">' +
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Partición ' + tablaParticiones[i].idParticion + '" data-toggle="popover" data-content="' + texto + '">P' + tablaParticiones[i].idProceso +'</a>' +
                '</div>'; // agrega la particion al mapa de memoria
        }
    }
    $('[data-toggle="popover"]').popover(); // hace que sean visibles los popover

    if (colaTerminados.length == tablaProcesos.length) { // esto quiere decir que terminaron todos los procesos, entonces tiene que terminar la simulacion
        document.getElementById("next").disabled = true; // deshabilita el boton de siguiente
        document.getElementById("tiempoActual").innerHTML = "Tiempo final: " + tiempoSimulacion; // muestra el tiempo final en el html
        console.log("Fin de la simulación"); // muestra por consola
        alert("Fin de la simulación"); // ESTO SE TIENE QUE CAMBIAR POR ALGO QUE MUESTRE EN EL HTML
    }
}

// algoritmo fcfs
function FCFS(cola) {
    var procesoADespachar = null; // proceso que se va a despachar a cpu
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        procesoADespachar = cola[0]; // elige el primer proceso de la cola
        cola.shift(); // elimina ese proceso de la cola
        if (recursoCPU.proceso === null) { // si no habia ningun proceso en la cpu, grafica el tiempo ocioso en el gantt
            recursoCPU.finRafaga = tiempoSimulacion; // pone el fin de rafaga como el tiempo actual
            agregarGanttCPU(null, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // agrega el tiempo ocioso al gantt
        }
        recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
        document.getElementById("usoDeCPU").innerHTML = "P" + recursoCPU.proceso.idProceso;
        recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
        if (recursoCPU.proceso.cicloVida[0] > 0) { // debe ejecutar su primera rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
        }
        else if (recursoCPU.proceso.cicloVida[2] > 0) { // debe ejecutar su segunda rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el tiempo de fin de rafaga
        }
        else if (recursoCPU.proceso.cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el tiempo de fin de rafaga
        }
        console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola    
    }
}

// algoritmo sjf
function SJF(cola) {
    var procesoADespachar = null; // proceso que se va a despachar a cpu
    var menorTiempo = Infinity; // menor tiempo de irrupcion
    var posicionEnLaCola = 0; // posicion en la cola del proceso con menor irrupcion
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        for (var i = 0; i < cola.length; i++) {
            if (cola[i].cicloVida[0] > 0) { // si el proceso debe ejecutar su primera rafaga de cpu
                if (cola[i].cicloVida[0] < menorTiempo) { // si la duracion de esa rafaga es menor al menor tiempo guardado
                    procesoADespachar = cola[i]; // elige ese proceso para despachar
                    menorTiempo = procesoADespachar.cicloVida[0]; // actualiza el menor tiempo
                    posicionEnLaCola = i; // guarda la posicion en la cola de ese proceso
                }
            }
            else if (cola[i].cicloVida[2] > 0) { // si el proceso debe ejecutar su segunda rafaga de cpu
                if (cola[i].cicloVida[2] < menorTiempo) { // si la duracion de esa rafaga es menor al menor tiempo guardado
                    procesoADespachar = cola[i]; // elige ese proceso para despachar
                    menorTiempo = procesoADespachar.cicloVida[2]; // actualiza el menor tiempo
                    posicionEnLaCola = i; // guarda la posicion en la cola de ese proceso
                }
            }
            else if (cola[i].cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
                if (cola[i].cicloVida[4] < menorTiempo) { // si la duracion de esa rafaga es menor al menor tiempo guardado
                    procesoADespachar = cola[i]; // elige ese proceso para despachar
                    menorTiempo = procesoADespachar.cicloVida[4]; // actualiza el menor tiempo
                    posicionEnLaCola = i; // guarda la posicion en la cola de ese proceso
                }
            }
        }
        cola.splice(posicionEnLaCola, 1); // elimina el proceso a despachar de la cola de listos
        if (recursoCPU.proceso === null) { // si no habia ningun proceso en la cpu, grafica el tiempo ocioso en el gantt
            recursoCPU.finRafaga = tiempoSimulacion; // pone el fin de rafaga como el tiempo actual
            agregarGanttCPU(null, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // agrega el tiempo ocioso al gantt
        }
        recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
        document.getElementById("usoDeCPU").innerHTML = "P" + recursoCPU.proceso.idProceso;
        recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
        if (recursoCPU.proceso.cicloVida[0] > 0) { // debe ejecutar su primera rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
        }
        else if (recursoCPU.proceso.cicloVida[2] > 0) { // debe ejecutar su segunda rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el tiempo de fin de rafaga
        }
        else if (recursoCPU.proceso.cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el tiempo de fin de rafaga
        }
        console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
    }
}

// algoritmo srtf
function SRTF(cola) {
    var procesoADespachar = null; // proceso que se va a despachar a cpu
    var menorTiempo = Infinity; // menor tiempo de irrupcion
    var posicionEnLaCola = 0; // posicion en la cola del proceso con menor irrupcion
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        for (var i = 0; i < cola.length; i++) {
            if (cola[i].cicloVida[0] > 0) { // si el proceso debe ejecutar su primera rafaga de cpu
                if (cola[i].cicloVida[0] < menorTiempo) { // si la duracion de esa rafaga es menor al menor tiempo guardado
                    procesoADespachar = cola[i]; // elige ese proceso para despachar
                    menorTiempo = procesoADespachar.cicloVida[0]; // actualiza el menor tiempo
                    posicionEnLaCola = i; // guarda la posicion en la cola de ese proceso
                }
            }
            else if (cola[i].cicloVida[2] > 0) { // si el proceso debe ejecutar su segunda rafaga de cpu
                if (cola[i].cicloVida[2] < menorTiempo) { // si la duracion de esa rafaga es menor al menor tiempo guardado
                    procesoADespachar = cola[i]; // elige ese proceso para despachar
                    menorTiempo = procesoADespachar.cicloVida[2]; // actualiza el menor tiempo
                    posicionEnLaCola = i; // guarda la posicion en la cola de ese proceso
                }
            }
            else if (cola[i].cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
                if (cola[i].cicloVida[4] < menorTiempo) { // si la duracion de esa rafaga es menor al menor tiempo guardado
                    procesoADespachar = cola[i]; // elige ese proceso para despachar
                    menorTiempo = procesoADespachar.cicloVida[4]; // actualiza el menor tiempo
                    posicionEnLaCola = i; // guarda la posicion en la cola de ese proceso
                }
            }
        }
    }
    if (procesoADespachar !== null) { // si hay un proceso a despachar es porque la cola no esta vacia
        if (recursoCPU.proceso !== null) { // si hay un proceso en cpu puede que sea desalojado
            if (procesoADespachar.cicloVida[0] < recursoCPU.proceso.cicloVida[0]) { // si el proceso puede ser desalojado
                recursoCPU.finRafaga = tiempoSimulacion; // asigna al fin de refaga el tiempo actual
                agregarGanttCPU(recursoCPU.proceso.idProceso, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // muestra en el grafico
                console.log("Proceso " + recursoCPU.proceso.idProceso + " desalojado de CPU"); // muestra por consola
                switch (recursoCPU.proceso.prioridad) { // segun la prioridad del proceso lo carga a su correspondiente cola de listos
                    case 1:
                        colaListos1.push(recursoCPU.proceso);
                        break;
                    case 2:
                        colaListos2.push(recursoCPU.proceso);
                        break;
                    case 3:
                        colaListos3.push(recursoCPU.proceso);
                        break;
                }
                recursoCPU.proceso = null; // desaloja el proceso de la cpu
                document.getElementById("usoDeCPU").innerHTML = "Libre";
                cola.splice(posicionEnLaCola, 1); // elimina el proceso a despachar de la cola de listos
                recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
                document.getElementById("usoDeCPU").innerHTML = "P" + recursoCPU.proceso.idProceso;
                recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
                if (recursoCPU.proceso.cicloVida[0] > 0) { // debe ejecutar su primera rafaga de cpu
                    recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
                }
                else if (recursoCPU.proceso.cicloVida[2] > 0) { // debe ejecutar su segunda rafaga de cpu
                    recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el tiempo de fin de rafaga
                }
                else if (recursoCPU.proceso.cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
                    recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el tiempo de fin de rafaga
                }
                console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
            }
        }
        else { // sino, la cpu esta vacia y el proceso se mete de una
            cola.splice(posicionEnLaCola, 1); // elimina el proceso a despachar de la cola de listos
            recursoCPU.finRafaga = tiempoSimulacion; // pone el fin de rafaga como el tiempo actual
            agregarGanttCPU(null, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // agrega el tiempo ocioso al gantt
            recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
            document.getElementById("usoDeCPU").innerHTML = "P" + recursoCPU.proceso.idProceso;
            recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
            if (recursoCPU.proceso.cicloVida[0] > 0) { // debe ejecutar su primera rafaga de cpu
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
            }
            else if (recursoCPU.proceso.cicloVida[2] > 0) { // debe ejecutar su segunda rafaga de cpu
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el tiempo de fin de rafaga
            }
            else if (recursoCPU.proceso.cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el tiempo de fin de rafaga
            }
            console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
        }
    }
}

// algoritmo round robin
function roundRobin(cola, quantum) {
    var procesoADespachar = null; // proceso que se va a despachar en la cpu
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        procesoADespachar = cola[0]; // elige el primer proceso de la cola
        cola.shift(); // elimina ese proceso de la cola
        if (recursoCPU.proceso === null) { // si no habia ningun proceso en la cpu, grafica el tiempo ocioso en el gantt
            recursoCPU.finRafaga = tiempoSimulacion; // pone el fin de rafaga como el tiempo actual
            agregarGanttCPU(null, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // agrega el tiempo ocioso al gantt
        }
        recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
        document.getElementById("usoDeCPU").innerHTML = "P" + recursoCPU.proceso.idProceso;
        recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
        if (recursoCPU.proceso.cicloVida[0] > 0) { // si tiene que ejecutar su primera rafaga de cpu
            if (recursoCPU.proceso.cicloVida[0] <= quantum) { // si lo que queda de rafaga es menor o igual al quantum
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el fin de rafaga como el tiempo actual mas lo que le queda de rafaga
                finDeQuantum = false; // pone a false para que cuando se alcance el fin de rafaga vaya a cola de bloqueados
            }
            else {
                recursoCPU.finRafaga = tiempoSimulacion + quantum; // asigna el fin de rafaga como el tiempo actual mas el quantum
                finDeQuantum = true; // pone a true para que cuando se alcance el fin de rafaga vaya a cola de listos de vuelta
            }
        } else if (recursoCPU.proceso.cicloVida[2] > 0) { // si tiene que ejecutar su segunda rafaga de cpu
            if (recursoCPU.proceso.cicloVida[2] <= quantum) { // si lo que queda de rafaga es menor o igual al quantum
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el fin de rafaga como el tiempo actual mas lo que le queda de rafaga
                finDeQuantum = false; // pone a false para que cuando se alcance el fin de rafaga vaya a cola de bloqueados
            }
            else {
                recursoCPU.finRafaga = tiempoSimulacion + quantum; // asigna el fin de rafaga como el tiempo actual mas el quantum
                finDeQuantum = true; // pone a true para que cuando se alcance el fin de rafaga vaya a cola de listos de vuelta
            }
        } else if (recursoCPU.proceso.cicloVida[4] > 0) { // si tiene que ejecutar su tercera rafaga de cpu
            if (recursoCPU.proceso.cicloVida[4] <= quantum) { // si lo que queda de rafaga es menor o igual al quantum
                recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el fin de rafaga como el tiempo actual mas lo que le queda de rafaga
                finDeQuantum = false; // pone a false para que cuando se alcance el fin de rafaga vaya a cola de bloqueados
            }
            else {
                recursoCPU.finRafaga = tiempoSimulacion + quantum; // asigna el fin de rafaga como el tiempo actual mas el quantum
                finDeQuantum = true; // pone a true para que cuando se alcance el fin de rafaga vaya a cola de listos de vuelta
            }
        }
        console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
    }
}

// algoritmo por prioridad
function porPrioridad(cola) {
    var procesoADespachar = null;
    var menorPrioridad = Infinity;
    var posicionEnLaCola = 0;
    if (cola.length > 0) { // si hay procesos en la cola busca ahi
        for (var i = 0; i < cola.length; i++) {
            if (cola[i].prioridad < menorPrioridad) {
                procesoADespachar = cola[i];
                menorPrioridad = procesoADespachar.prioridad;
                posicionEnLaCola = i;
            }
        }
        cola.splice(posicionEnLaCola, 1); // elimina el proceso a despachar de la cola de listos
        if (recursoCPU.proceso === null) { // si no habia ningun proceso en la cpu, grafica el tiempo ocioso en el gantt
            recursoCPU.finRafaga = tiempoSimulacion; // pone el fin de rafaga como el tiempo actual
            agregarGanttCPU(null, recursoCPU.inicioRafaga, recursoCPU.finRafaga); // agrega el tiempo ocioso al gantt
        }
        recursoCPU.proceso = procesoADespachar; // asigna a la cpu el proceso a despachar
        document.getElementById("usoDeCPU").innerHTML = "P" + recursoCPU.proceso.idProceso;
        recursoCPU.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual al inicio de rafaga
        if (recursoCPU.proceso.cicloVida[0] > 0) { // debe ejecutar su primera rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[0]; // asigna el tiempo de fin de rafaga
        }
        else if (recursoCPU.proceso.cicloVida[2] > 0) { // debe ejecutar su segunda rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[2]; // asigna el tiempo de fin de rafaga
        }
        else if (recursoCPU.proceso.cicloVida[4] > 0) { // debe ejecutar su tercera rafaga de cpu
            recursoCPU.finRafaga = tiempoSimulacion + recursoCPU.proceso.cicloVida[4]; // asigna el tiempo de fin de rafaga
        }
        console.log("Proceso " + recursoCPU.proceso.idProceso + " ingresó a CPU"); // muestra por consola
    }
}

// algoritmo first fit para particiones fijas
function firstFitFijas() {
    for (var i = 0;  i < colaNuevos.length; i++) { // itera por la cola de nuevos
        var admitido = false; // indica si un proceso fue admitido en memoria o no
        var j = 0; // para iterar sobre la tabla de particiones
        while (j < tablaParticiones.length && !admitido) { // itera por la tabla de particiones
            if ((tablaParticiones[j].tamaño >= colaNuevos[i].tamaño) && (tablaParticiones[j].estado == 0)) { // si la particion esta libre y el proceso entra
                tablaParticiones[j].estado = 1; // asigna el estado ocupado a la particion
                tablaParticiones[j].idProceso = colaNuevos[i].idProceso; // asigna el id de proceso a la particion
                tablaParticiones[j].FI = tablaParticiones[j].tamaño - colaNuevos[i].tamaño; // asigna la fragmentacion interna
                console.log("Proceso " + tablaParticiones[j].idProceso + " asignado a la partición " + tablaParticiones[j].idParticion); // muestra por consola
                switch (colaNuevos[i].prioridad) { // segun la prioridad del proceso lo carga a su correspondiente cola de listos
                    case 1:
                        colaListos1.procesos.push(colaNuevos[i]);
                        break;
                    case 2:
                        colaListos2.procesos.push(colaNuevos[i]);
                        break;
                    case 3:
                        colaListos3.procesos.push(colaNuevos[i]);
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
            tablaParticiones[mejorAjuste].estado = 1; // asigna el estado ocupado a la particion
            tablaParticiones[mejorAjuste].idProceso = colaNuevos[i].idProceso; // asigna el id de proceso a la particion
            tablaParticiones[mejorAjuste].FI = tablaParticiones[mejorAjuste].tamaño - colaNuevos[i].tamaño; // asigna la fragmentacion interna
            console.log("Proceso " + tablaParticiones[mejorAjuste].idProceso + " asignado a la partición " + tablaParticiones[mejorAjuste].idParticion); // muestra por consola
            switch (colaNuevos[i].prioridad) { // segun la prioridad del proceso lo carga a su correspondiente cola de listos
                case 1:
                    colaListos1.procesos.push(colaNuevos[i]);
                    break;
                case 2:
                    colaListos2.procesos.push(colaNuevos[i]);
                    break;
                case 3:
                    colaListos3.procesos.push(colaNuevos[i]);
                    break;
            }
            colaNuevos.splice(i, 1); // elimina al proceso de la cola de nuevos
        }
    }
}

// algoritmo first fit para particiones variables
function firstFitVariables() {
    var idParticion = 1;
    var posicionEnLaTabla;
    var admitido = false;
    var espacioParaCompactacion = 0;
    for (var i = 0; i < colaNuevos.length; i++) {
        admitido = false;
        if (tablaParticiones.length == 0) { // si no hay particiones es la primera vez que se ejecuta
            var particion = { // se crea una particion
                "idParticion": idParticion,
                "dirInicio": condicionesInciales.tamanoSO,
                "dirFin": colaNuevos[i].tamaño - 1,
                "tamaño": colaNuevos[i].tamaño,
                "estado": 1,
                "idProceso": colaNuevos[i].idProceso,
                "FI": 0,
            };
            tablaParticiones.push(particion); // agrega la particion a la tabla
            posicionEnLaTabla = 0; // guarda la posicion en la tabla de esa particion
            admitido = true; // indica que el proceso fue admitido
            idParticion++;
            var particion = { // crea otra particion para el espacio que quedo libre
                "idParticion": idParticion,
                "dirInicio": tablaParticiones[0].dirFin + 1,
                "dirFin": condicionesInciales.tamanoMP - 1,
                "tamaño": (condicionesInciales.tamanoMP - 1) - (tablaParticiones[0].dirFin + 1) + 1,
                "estado": 0,
                "idProceso": null,
                "FI": 0,
            }
            tablaParticiones.push(particion); // agrega esa particion a la tabla
        }
        else { // si ya hay particiones tiene que ver donde meter o crear una nueva
            var j = 0; // variable para recorrer la tabla de particiones
            while (j < tablaParticiones.length && !admitido) { //busca por toda la tabla de particiones mientras no sea admitido el proceso
                if ((tablaParticiones[j].estado == 0) && (tablaParticiones[j].tamaño < colaNuevos[i].tamaño)) { // si la particion esta libre pero el proceso no entra, se guarda su tamaño para poder compactar
                    espacioParaCompactacion += tablaParticiones[j].tamaño;
                }
                if ((tablaParticiones[j].estado == 0) && (tablaParticiones[j].tamaño >= colaNuevos[i].tamaño)) { // si la particion esta libre y el proceso entra, se lo pone ahi
                    tablaParticiones[j].estado = 1; // le asigna el estado de ocupado
                    tablaParticiones[j].idProceso = colaNuevos[i].idProceso; // le asigna el id del proceso
                    posicionEnLaTabla = j; // guarda la posicion en la tabla de la particion
                    admitido = true; // indica que el proceso fue admitido
                    if (tablaParticiones[j].tamaño > colaNuevos[i].tamaño) { // si la particion es mas grande que el proceso hay que recortar lo que sobra
                        tablaParticiones[j].dirFin = tablaParticiones[j].dirInicio + colaNuevos[i].tamaño - 1, // actualiza la direccion de fin
                        tablaParticiones[j].tamaño = colaNuevos[i].tamaño; // actualiza el tamaño
                        if (j == tablaParticiones.length - 1) { // si es la ultima particion la actual, el pedazo recortado se carga usando el tamaño de memoria
                            var pedazoRecortado = { // particion que va a contener el pedazo que se recorto de la particion donde entro el proceso
                                "idParticion": tablaParticiones[j].idParticion + 1,
                                "dirInicio": tablaParticiones[j].dirFin + 1,
                                "dirFin": condicionesInciales.tamanoMP - 1,
                                "tamaño": (condicionesInciales.tamanoMP - 1) - (tablaParticiones[j].dirFin + 1) + 1,
                                "estado": 0,
                                "idProceso": null,
                                "FI": 0,
                            }
                        }
                        else { // si la particion actual no es la ultima, el pedazo recortado se define segun la particion siguiente
                            var pedazoRecortado = { // particion que va a contener el pedazo que se recorto de la particion donde entro el proceso
                                "idParticion": tablaParticiones[j].idParticion + 1,
                                "dirInicio": tablaParticiones[j].dirFin + 1,
                                "dirFin": tablaParticiones[j + 1].dirInicio - 1,
                                "tamaño": (tablaParticiones[j + 1].dirInicio - 1) - (tablaParticiones[j].dirFin + 1) + 1,
                                "estado": 0,
                                "idProceso": null,
                                "FI": 0,
                            }
                        }
                        tablaParticiones.splice(j + 1, 0, pedazoRecortado); // agrega el pedazo recortado a la tabla
                        for (var k = 0; k < tablaParticiones.length; k++) { // actualiza los id de todas las particiones
                            tablaParticiones[k].idParticion = k + 1;
                        }
                    }
                }
                j++; // necesita comentario esto?
            }
        }
        if (!admitido) { // si el proceso no fue admitido en memoria
            if (espacioParaCompactacion >= colaNuevos[i].tamaño) { // si el espacio vacio (suma de todas las particiones libres) es mayor o igual al tamaño del proceso no admitido
                compactacion(); // hace la compactacion
                tablaParticiones[tablaParticiones.length - 1].estado = 1; // pone como ocupada la ultima particion (creada en la compactacion)
                tablaParticiones[tablaParticiones.length - 1].idProceso = colaNuevos[i].idProceso; // le asigna a esa particion el id del proceso
                if (tablaParticiones[tablaParticiones.length - 1].tamaño > colaNuevos[i].idProceso) { // si la particion es mas grande que el proceso, se crea otra con el espacio que sobra
                    tablaParticiones[tablaParticiones.length - 1].dirFin = tablaParticiones[tablaParticiones.length - 1].dirInicio + colaNuevos[i].tamaño - 1, // actualiza la direccion de fin
                    tablaParticiones[tablaParticiones.length - 1].tamaño = colaNuevos[i].tamaño; // actualiza el tamaño
                    var pedazoRecortado = { // particion que va a contener el pedazo que se recorto de la particion donde entro el proceso
                        "idParticion": tablaParticiones.length,
                        "dirInicio": tablaParticiones[tablaParticiones.length - 1].dirFin + 1,
                        "dirFin": condicionesInciales.tamanoMP - 1,
                        "tamaño": (condicionesInciales.tamanoMP - 1) - (tablaParticiones[tablaParticiones.length - 1].dirFin + 1) + 1,
                        "estado": 0,
                        "idProceso": null,
                        "FI": 0,
                    }
                    tablaParticiones.push(pedazoRecortado); // agrega el pedazo recortado a la tabla
                    for (var k = 0; k < tablaParticiones.length; k++) { // actualiza los id de todas las particiones
                        tablaParticiones[k].idParticion = k + 1;
                    }
                }
            }
            else {
                console.log("Proceso " + colaNuevos[i].idProceso + " no admitido en memoria por falta de espacio");
            }
        }
        if (admitido) { // si el proceso fue admitido en memoria
            console.log("Proceso " + tablaParticiones[posicionEnLaTabla].idProceso + " asignado a la partición " + tablaParticiones[posicionEnLaTabla].idParticion); // muestra por consola
            switch (colaNuevos[i].prioridad) { // segun la prioridad del proceso lo carga a su correspondiente cola de listos
                case 1:
                    colaListos1.procesos.push(colaNuevos[i]);
                    break;
                case 2:
                    colaListos2.procesos.push(colaNuevos[i]);
                    break;
                case 3:
                    colaListos3.procesos.push(colaNuevos[i]);
                    break;
            }
            colaNuevos.splice(i, 1); // elimina al proceso de la cola de nuevos
        }
    }
}

// algoritmo worst fit
function worstFit() {
    //
}

// compactacion de la memoria (une todas las particiones libres en una sola al final de todo)
function compactacion() {
    for (var i = 0; i < tablaParticiones.length; i++) { // itera por toda la tabla de particiones
        if (tablaParticiones[i].estado == 0) {
            tablaParticiones[j].dirInicio;
        }
    }
}

// agrega algo al diagrama de gantt de cpu
function agregarGanttCPU(proceso, inicio, fin) {
    if (inicio != fin) { // si inicio == fin entonces no tiene ningun chiste que dibuje
        var texto = "Desde " + inicio + " hasta " + fin; // el texto que va a indicar de cuando a cuando estuvo el proceso
        if (proceso !== null) { // si proceso no es null significa que hubo un proceso ocupando el recurso
            document.getElementById("cola_cpu").innerHTML +=
                '<div id="P' + proceso + '" class="progress-bar" role="progressbar" style="width:20%">' +
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Proceso ' + proceso + '" data-toggle="popover" data-content="' + texto + '">P' + proceso + '</a>' +
                '</div>'; // agrega al diagrama el proceso
        }
        else { // si proceso es null significa que el recurso estuvo ocioso
            document.getElementById("cola_cpu").innerHTML +=
                '<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Tiempo Ocioso" data-toggle="popover" data-content="' + texto + '"> ** </a>' +
                '</div>'; // agrega al diagrama el tiempo ocioso
        }
        $('[data-toggle="popover"]').popover(); // hace el popover
    }
}

// agrega algo al diagrama de gantt de entrada
function agregarGanttE(proceso, inicio, fin) {
    if (inicio != fin) { // si inicio == fin entonces no tiene ningun chiste que dibuje
        var texto = "Desde " + inicio + " hasta " + fin; // el texto que va a indicar de cuando a cuando estuvo el proceso
        if (proceso !== null) { // si proceso no es null significa que hubo un proceso ocupando el recurso
            document.getElementById("cola_e").innerHTML +=
                '<div id="P' + proceso + '" class="progress-bar" role="progressbar" style="width:20%">' +
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Proceso ' + proceso + '" data-toggle="popover" data-content="' + texto + '">P' + proceso + '</a>' +
                '</div>'; // agrega al diagrama el proceso
        }
        else { // si proceso es null significa que el recurso estuvo ocioso
            document.getElementById("cola_e").innerHTML +=
                '<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Tiempo Ocioso" data-toggle="popover" data-content="' + texto + '"> ** </a>' +
                '</div>'; // agrega al diagrama el tiempo ocioso
        }
        $('[data-toggle="popover"]').popover(); // hace el popover
    }
}

// agrega algo al diagrama de gantt de salida
function agregarGanttS(proceso, inicio, fin) {
    if (inicio != fin) { // si inicio == fin entonces no tiene ningun chiste que dibuje
        var texto = "Desde " + inicio + " hasta " + fin; // el texto que va a indicar de cuando a cuando estuvo el proceso
        if (proceso !== null) { // si proceso no es null significa que hubo un proceso ocupando el recurso
            document.getElementById("cola_s").innerHTML +=
                '<div id="P' + proceso + '" class="progress-bar" role="progressbar" style="width:20%">' +
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Proceso ' + proceso + '" data-toggle="popover" data-content="' + texto + '">P' + proceso + '</a>' +
                '</div>'; // agrega al diagrama el proceso
        }
        else { // si proceso es null significa que el recurso estuvo ocioso
            document.getElementById("cola_s").innerHTML +=
                '<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
                '  <a data-trigger="hover" data-placement="bottom" data-original-title="Tiempo Ocioso" data-toggle="popover" data-content="' + texto + '"> ** </a>' +
                '</div>'; // agrega al diagrama el tiempo ocioso
        }
        $('[data-toggle="popover"]').popover(); // hace el popover
    }
}