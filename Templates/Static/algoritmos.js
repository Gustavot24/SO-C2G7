//Resolucion de algoritmos de planificación de procesos

//declaracion de variables
var t_simulacion=0;
var t_cpu=0;
var t_es=0;
var cola_nuevo=[];
var cola_listo=[];
var cola_bloqueado=[];
var cola_terminado=[];
var cola_cpu=[];
var cola_es=[];
var tablaParticiones=condicionesInciales.tablaParticiones;
var algoritmo= toString(condicionesInciales.algoritmo);

//Algoritmo FCFS para particiones Fijas
function FCFS() {
    do {
        //Buscar un proceso donde TA=TSimulacion y agregarlo cola nuevo
        for (let i = 0; i < tablaProcesos.length; i++) {
            const element = tablaProcesos[i];
            if (element.tiempoArribo==t_simulacion) {
                cola_nuevo.push(element);
            }
        }
        console.log("tiempo simulacion "+ t_simulacion);
        console.log("C nuevo " + cola_nuevo);
            
        var exito=false
        agregarMP: do {
            //Asignar esos procesos de la cola nuevo a la MP y a la cola listo
            if (cola_nuevo.length>0) { //si significa que hay procesos para entrar a MP
                switch (algoritmo) {
                    case "FF":
                        firstFit();
                    break;
                    case "FV":
                        firstFitVble();
                    break;
                    case "B":
                        bestFit();
                    break;
                    case "W":
                        worstFit();
                    break;
                }
            }
            //Asignar los procesos de la cola listo a la cpu
            if (cola_listo.length>0) {
                if (cola_cpu.length==0) { //No hay procesos ejecutandose en cpu
                    var proceso = cola_listo[0];
                    cola_cpu.push(proceso);
                    var i = proceso.posicion;
                    t_cpu = proceso.cicloVida[i];
                    exito = true; //para salir del ciclo
                } else { //Si hay proceso ejecutando cpu
                    if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                        var proceso = cola_listo[0];
                        proceso.posicion ++;
                        cola_cpu.shift();
                        if (proceso.posicion==5) {//Termine de ejecutar el utlimo tiempo de cpu pasa a la cola terminado
                            cola_terminado.push(proceso);
                            cola_listo.shift();
                            exito = true;
                            idProceso=proceso.idProceso;
                            quitar_MP(idProceso); //cuando termina de ejecutar su ciclo de vida. Debe ser eliminado de mp
                            if (cola_nuevo.length>0) { //si significa que hay procesos para entrar a MP
                                exito=false;
                                continue agregarMP;                           
                            }                        
                        } else {//Termino de ejecutar cpu pasa a e/s
                            cola_bloqueado.push(proceso);
                            cola_listo.shift();
                        }                
                    }else{
                        exito=true;
                    }
                }
            }
    
            //Asignar los procesos de la cola de bloqueados a la e/s
            if (cola_bloqueado.length>0) {
                if (cola_es.length==0) { //No hay procesos ejecutandose en es
                    var proceso = cola_bloqueado[0];
                    cola_es.push(proceso);
                    var i = proceso.posicion;
                    t_es = proceso.cicloVida[i];
                    if (cola_listo.length<0) { //hay un proceso en cola, vuelvo arriba
                        exito=true;
                    }             
                } else { //Si hay proceso ejecutando es
                    if (t_es==0) { //Pregunto si termino de ejecutar su tiempo de es
                        var proceso = cola_bloqueado[0];
                        proceso.posicion ++;
                        cola_listo.push(proceso);
                        cola_bloqueado.shift();  
                        cola_es.shift();           
                    }else{
                        exito=true;
                    }
                }
            }
    
        } while (exito==false);
    
        t_simulacion ++;
        t_cpu --;
        t_es --;
    
        
        console.log("C listo " + cola_listo);
        console.log("C bloqueado " + cola_bloqueado);
        console.log("C terminado " + cola_terminado);
    
    } while (cola_terminado.length < tablaProcesos.length);
}



function firstFit() {
    for (let i = 0; i < cola_nuevo.length; i++) {
        const proceso = cola_nuevo[i];
        var exito = false;
        var j=0;
        do {        
            const particion = tablaParticiones[j];
            if ((particion.tamano > proceso.tamano)&&(particion.estado==0)) {  
                exito=true;              
                particion.estado=1;
                particion.idProceso=proceso.idProceso;
                particion.FI=(particion.tamano-proceso.tamano);
                cola_listo.push(proceso);
                cola_nuevo.splice(i,1);
            }
            j ++;
        } while ((exito == false) && (j < tablaParticiones.length));
    }
}

function bestFit() {  
    var fiTotal=0; 
    var idpart=0;
    for (let i = 0; i < cola_nuevo.length; i++) {
        const procesoi = cola_nuevo[i];
        var fiactual=0;
        var exito2 = false;
        var j=0;
        do {            
            const particioni = tablaParticiones[j];
            if (exito2==false) {
                if ((procesoi.tamaño<=particioni.tamaño) && (particioni.estado==0)) {
                    idpart=particioni.idParticion;
                    fiactual=(particioni.tamaño-procesoi.tamaño);
                    exito2=true;
                } 
                
            } else {
                if ((procesoi.tamaño<=particioni.tamaño) && (particioni.estado==0)) {
                    var ficompara=(particioni.tamaño-procesoi.tamaño);
                    if (ficompara<fiactual) {
                        idpart=particioni.idParticion;
                        fiactual=ficompara;
                    }                    
                }
            }
            j++;
        } while ( j<tablaParticiones.length);

        if (exito2==true) {
            idpart=idpart-1;
            const particioni = tablaParticiones[idpart];
            particioni.estado=1;
            particioni.idProceso=(i+1);
            particioni.FI=fiactual;
            fiTotal=fiactual+fiTotal;
            cola_listo.push(procesoi);
            cola_nuevo.splice(i,1);
        }
    }
}

function quitar_MP(idProceso) {
    for (let i = 0; i < tablaParticiones.length; i++) {
        const particion = tablaParticiones[i];
        if (particion.idProceso==idProceso) {
            particion.idProceso=null;
            particion.estado=0;
            particion.FI=0;
        }
    }
}
