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
    tiempoSimulacion++;
    console.log("TIEMPO " + tiempoSimulacion);

    if (recursoCPU.proceso === null) { // se ejecuta cuando la cpu esta vacia
        // asd
    }

    if (recursoCPU.proceso !== null) { // se ejecuta cuando la cpu esta llena
        // asd
    }

    if (recursoE.proceso === null) { // se ejecuta cuando la e/s esta vacia
        if (colaBloqueadosE.length > 0) { // si hay procesos en cola de bloqueados
            recursoE.finRafaga = tiempoSimulacion; // asigna al fin de rafaga (ocioso) el tiempo actual
            // MOSTRAR EN EL GRAFICO // se muestra en el grafico el tiempo que estuvo ocioso
            recursoE.proceso = colaBloqueadosE[0]; // asigna el primer proceso de la cola a la e/s
            recursoE.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
            recursoE.finRafaga = tiempoSimulacion + recursoE.proceso.cicloVida[1]; // asigna el tiempo de fin de la rafaga
            colaBloqueados.shift(); // elimina ese proceso de la cola de bloqueados
            // MOSTRAR EN EL GRAFICO // se muestra en el grafico el tiempo que va a estar el proceso
            console.log("Proceso " + recursoE.idProceso + " ingresó a E"); // muestra por consola
        }
        else { // si no hay procesos en cola de bloqueados
            console.log("E continúa ocioso"); // muestra por consola
        }
    }

    if (recursoE.proceso !== null) { // se ejecuta cuando la e/s esta llena
        if (recursoE.finRafaga == tiempoSimulacion) { // si el fin de rafaga es igual al tiempo actual, el proceso sale de la entrada
            switch (recursoE.proceso.prioridad) { // coloca el proceso en la cola de listos correspondiente a su prioridad
                case 1: colaListos1.procesos.push(recursoE.proceso);
                        break;
                case 2: colaListos2.procesos.push(recursoE.proceso);
                        break;
                case 3: colaListos3.procesos.push(recursoE.proceso);
                        break;
            }
            console.log("Proceso " + recursoE.proceso.idProceso + " salió de E"); // muestra por consola
            recursoE.proceso = null; // se saca al proceso de la entrada
            recursoE.inicioRafaga = tiempoSimulacion; // se asigna al inicio de rafaga el tiempo actual
            if (colaBloqueadosE.length > 0) { // si hay procesos que quieren entrar en la entrada
                recursoE.proceso = colaBloqueadosE[0]; // asigna el primer proceso de la cola a la e/s
                recursoE.inicioRafaga = tiempoSimulacion; // asigna el tiempo actual como inicio de la rafaga
                recursoE.finRafaga = tiempoSimulacion + recursoE.proceso.cicloVida[1]; // asigna el tiempo de fin de la rafaga
                colaBloqueados.shift(); // elimina ese proceso de la cola de bloqueados
                // MOSTRAR EN EL GRAFICO // se muestra en el grafico el tiempo que va a estar el proceso
                console.log("Proceso " + recursoE.idProceso + " ingresó a E"); // muestra por consola    
            }
            else { // sino la entrada va a quedar ociosa por no se cuanto tiempo
                recursoE.finRafaga = null; // se deja el fin de rafaga como null (no se cuando va a dejar de estar ocioso)
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