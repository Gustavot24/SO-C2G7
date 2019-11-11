//Resolucion de algoritmos de planificación de procesos
var tablaParticiones = [];
var particion ={ //se crea el object
    "idParticion": 1,
    "dirInicio": 31,
    "dirFin": 37,
    "tamaño": 6,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
var particion ={ //se crea el object
    "idParticion": 2,
    "dirInicio": 38,
    "dirFin": 57,
    "tamaño": 20,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
var particion ={ //se crea el object
    "idParticion": 3,
    "dirInicio": 58,
    "dirFin": 127,
    "tamaño": 70,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
console.log(tablaParticiones);
var tablaProcesos=[];
var proceso = {
    "idProceso": 1,
    "tamaño": 15,
    "prioridad": 1,
    "tiempoArribo": 0,
    "cicloVida": [1,3,4,3,1],
    "posicion":0,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 2,
    "tamaño": 20,
    "prioridad": 1,
    "tiempoArribo": 3,
    "cicloVida": [1,2,3,2,1],
    "posicion":0,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 3,
    "tamaño": 6,
    "prioridad": 1,
    "tiempoArribo": 5,
    "cicloVida": [1,3,2,1,1],
    "posicion":0,
};
tablaProcesos.push(proceso);
console.log(tablaProcesos);
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
SJF();
//var tablaParticiones=condicionesInciales.tablaParticiones;

function SJF() {    
    var algoritmo= "FF";//toString(condicionesInciales.algoritmo);
    var tipoPart="F";//toString(condicionesInciales.tipoParticion);
    var algoritmo2="FCFS"; //o puede ser sjf
    var to_es=0; //tiempo oscioso e/s
    var to_cpu=0; //tiempo oscioso cpu
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
            if (cola_listo.length>0) { //Primero pregunto si la cola contiene algun proceso.
                if (cola_cpu.length==0) { //No hay procesos ejecutandose en cpu
                    var pos=0;                    
                    if (cola_listo.length>1 && algoritmo2=="SJF") {
                        var irrupcion_cpu =10000;
                        for (let k = 0; k < cola_listo.length; k++) {
                            const proceso = cola_listo[k];
                            var posicion=proceso.posicion;
                            var duracion=proceso.cicloVida[posicion];
                            if (duracion<irrupcion_cpu) {
                                irrupcion_cpu=duracion;
                                pos=k;
                            }
                        }
                    }                
                    var proceso = cola_listo[pos];
                    cola_cpu.push(proceso);                    
                    add_to_cpu(to_cpu);
                    to_cpu=0;
                    var i = proceso.posicion;
                    t_cpu = proceso.cicloVida[i];
                    exito = true; //para salir del ciclo
                } else { //Si hay proceso ejecutando cpu
                    if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                        var proceso = cola_listo[0];
                        proceso.posicion ++;
                        cola_cpu.shift();
                        add_cola_cpu(proceso);
                        if (proceso.posicion==5) {//Termine de ejecutar el utlimo tiempo de cpu pasa a la cola terminado
                            cola_terminado.push(proceso);
                            cola_listo.shift();
                            exito = true;
                            idProceso=proceso.idProceso;
                            switch (tipoPart) {
                                case "F":
                                    quitar_MP(idProceso); //cuando termina de ejecutar su ciclo de vida. Debe ser eliminado de mp
                                break;                            
                                case "V":
                                    quitarVariable(idProceso);
                                break;
                            }                      
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
            }else{
                to_cpu++;
            }
        
    
            //Asignar los procesos de la cola de bloqueados a la e/s
            if (cola_bloqueado.length>0) {
                if (cola_es.length==0) { //No hay procesos ejecutandose en es
                    var pos=0;
                    if (cola_bloqueado.length>1 && algoritmo2=="SJF") {
                        var irrupcion_es=10000;
                        for (let k = 0; k < cola_bloqueado.length; k++) {
                            const proceso = cola_bloqueado[k];
                            var posicion=proceso.posicion;
                            var duracion=proceso.cicloVida[posicion];
                            if (duracion<irrupcion_es) {
                                irrupcion_es=duracion;
                                pos=k;
                            }
                        }
                    }                
                    add_to_es(to_es);
                    to_es=0;
                    var proceso = cola_bloqueado[pos];
                    cola_es.push(proceso);
                    var i = proceso.posicion;
                    t_es = proceso.cicloVida[i];                    
                    if (cola_listo.length<=0) { //si hay un proceso en cola, vuelvo arriba
                        exito=true;
                        to_cpu++;
                    }             
                } else { //Si hay proceso ejecutando es
                    if (t_es==0) { //Pregunto si termino de ejecutar su tiempo de es
                        var proceso = cola_bloqueado[0];
                        proceso.posicion ++;
                        add_cola_es(proceso);
                        cola_listo.push(proceso);
                        cola_bloqueado.shift();  
                        cola_es.shift();   
                        if (cola_bloqueado.length>0 |cola_cpu.length==0) {
                            exito=false;
                        }
                        if (exito==true) {
                            to_es++; 
                        }                               
                    }else{
                        if (cola_listo.length<=0 && cola_cpu.length==0) { //si no, hay un proceso en cola, vuelvo arriba
                            exito=true;
                        } 
                    }
                }
            }else{
                to_es++;                
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

//Algoritmo FCFS para particiones Fijas
function FCFS() {    
    var algoritmo= "FF";//toString(condicionesInciales.algoritmo);
    var tipoPart="F";//toString(condicionesInciales.tipoParticion);
    var to_es=0; //tiempo oscioso e/s
    var to_cpu=0; //tiempo oscioso cpu
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
            if (cola_listo.length>0) { //Primero pregunto si la cola contiene algun proceso.
                if (cola_cpu.length==0) { //No hay procesos ejecutandose en cpu
                    var proceso = cola_listo[0];
                    cola_cpu.push(proceso);                    
                    add_to_cpu(to_cpu);
                    to_cpu=0;
                    var i = proceso.posicion;
                    t_cpu = proceso.cicloVida[i];
                    exito = true; //para salir del ciclo
                } else { //Si hay proceso ejecutando cpu
                    if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                        var proceso = cola_listo[0];
                        proceso.posicion ++;
                        cola_cpu.shift();
                        add_cola_cpu(proceso);
                        if (proceso.posicion==5) {//Termine de ejecutar el utlimo tiempo de cpu pasa a la cola terminado
                            cola_terminado.push(proceso);
                            cola_listo.shift();
                            exito = true;
                            idProceso=proceso.idProceso;
                            switch (tipoPart) {
                                case "F":
                                    quitar_MP(idProceso); //cuando termina de ejecutar su ciclo de vida. Debe ser eliminado de mp
                                break;                            
                                case "V":
                                    quitarVariable(idProceso);
                                break;
                            }                      
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
            }else{
                to_cpu++;
            }
        
    
            //Asignar los procesos de la cola de bloqueados a la e/s
            if (cola_bloqueado.length>0) {
                if (cola_es.length==0) { //No hay procesos ejecutandose en es
                    add_to_es(to_es);
                    to_es=0;
                    var proceso = cola_bloqueado[0];
                    cola_es.push(proceso);
                    var i = proceso.posicion;
                    t_es = proceso.cicloVida[i];                    
                    if (cola_listo.length<=0) { //si hay un proceso en cola, vuelvo arriba
                        exito=true;
                    }             
                } else { //Si hay proceso ejecutando es
                    if (t_es==0) { //Pregunto si termino de ejecutar su tiempo de es
                        var proceso = cola_bloqueado[0];
                        proceso.posicion ++;
                        add_cola_es(proceso);
                        cola_listo.push(proceso);
                        cola_bloqueado.shift();  
                        cola_es.shift();   
                        if (exito==true) {
                            to_es++; 
                        }                               
                    }else{
                        exito=true;
                    }
                }
            }else{
                to_es++;                
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


//Algoritmo FirstFit para Particiones Fijas
function firstFit() {
    for (let i = 0; i < cola_nuevo.length; i++) {
        const proceso = cola_nuevo[i];
        var exito = false;
        var j=0;
        do {        
            const particion = tablaParticiones[j];
            if ((particion.tamaño >= proceso.tamaño)&&(particion.estado==0)) {  
                exito=true;              
                particion.estado=1;
                particion.idProceso=proceso.idProceso;
                particion.FI=(particion.tamaño-proceso.tamaño);
                cola_listo.push(proceso);
                cola_nuevo.splice(i,1);
            }
            j ++;
        } while ((exito == false) && (j < tablaParticiones.length));
    }
}
//Algoritmo BestFit para Particiones Fijas
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
//Funcion que quita de la MP un proceso cuando es particion fija
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

//FirstFit para particiones variables
var tamanoLibre= 921;//(condicionesInciales.tamanoMP-condicionesInciales.tamanoSO);
var direccionLibre = 103;//condicionesInciales.tamanoSO;
function firstFitVble() {
    for (let i = 0; i < cola_nuevo.length; i++) {
        const proceso = cola_nuevo[i];
        var tamanoProceso=proceso.tamaño;
        if (tablaParticiones.length==0) {
            if (tamanoLibre>=proceso.tamaño) {
                var idPart=tablaParticiones.length;
                var particion3 ={ //se crea el object
                    "idParticion": (idPart+1),
                    "dirInicio": direccionLibre,
                    "dirFin": (direccionLibre+proceso.tamaño-1),
                    "tamaño": proceso.tamaño,
                    "estado": 1, //0 libre 1 ocupado
                    "idProceso": proceso.idProceso,
                    "FI": 0,
                };
                tablaParticiones.push(particion3);
                direccionLibre=direccionLibre+tamanoProceso;
                tamanoLibre=tamanoLibre-tamanoProceso;
            }
        } else {        
            var j=0;
            var exito=false;
            do {
                const particion = tablaParticiones[j];
                var tamanoPart=particion.tamaño;            
                if (particion.estado==0 && tamanoPart>=tamanoProceso) {
                    exito=true;
                    var diferencia = tamanoPart-tamanoProceso;
                    switch (diferencia) {
                        case 0:
                            particion.idProceso=proceso.idProceso;
                            particion.estado=1;
                        break;
                        case diferencia>0:
                            particion.idProceso=proceso.idProceso;
                            particion.estado=1;
                            particion.tamaño=tamanoProceso;                        
                            var direccionFin=(particion.dirInicio+tamanoProceso-1);
                            particion.dirFin=direccionFin;
                            var idPart=particion.idParticion;
                            var k = tablaParticiones.length;
                            do {
                                const particion2 = tablaParticiones[(k-1)];
                                particion2.idParticion=(particion2.idParticion+1);
                                tablaParticiones.push(particion2);
                                tablaParticiones.splice((k-1),1);
                                k--;
                            } while (k>idPart);
                            var particion3 ={ //se crea el object
                                "idParticion": (idPart+1),
                                "dirInicio": (direccionFin+1),
                                "dirFin": 127,
                                "tamano": diferencia,
                                "estado": 0, //0 libre 1 ocupado
                                "idProceso": null,
                                "FI": 0,
                            };
                            tablaParticiones.push(particion3);
                        break;
                    }
                }  
                j++;
            } while (j < tablaParticiones.length && exito==false);
            if (exito==false) {
                if (tamanoLibre>=proceso.tamaño) {
                    var idPart=tablaParticiones.length;
                    var particion3 ={ //se crea el object
                        "idParticion": (idPart+1),
                        "dirInicio": direccionLibre,
                        "dirFin": (direccionLibre+proceso.tamaño-1),
                        "tamano": proceso.tamaño,
                        "estado": 1, //0 libre 1 ocupado
                        "idProceso": proceso.idProceso,
                        "FI": 0,
                    };
                    tablaParticiones.push(particion3);
                    direccionLibre=direccionLibre+tamanoProceso;
                    tamanoLibre=tamanoLibre-tamanoProceso;
                } 
            }
        }
    }
}
//Quitar de MP cuando es variable
function quitarVariable(idProceso) {
    for (let i = 0; i < tablaParticiones.length; i++) {
        const particion = tablaParticiones[i];
        var exito=false;
        if (particion.idProceso==idProceso) {
            particion.estado=0;
            particion.idProceso=null;
            if ((i-1)>=0) {
                var exito2=false;
                const particion2 = tablaParticiones[i-1];
                if (particion2.estado==0) {//unir
                    particion2.dirFin=particion.dirFin;
                    particion2.tamano=particion2.tamano+particion.tamaño;
                    exito2=true;
                }
                exito=true;
                if ((i+1)<tablaParticiones.length) {
                    const particion3 = tablaParticiones[i+1];
                    if (particion3.estado==0) {//unir
                        particion2.dirFin=particion3.dirFin;
                        particion2.tamano=particion2.tamano+particion3.tamano;
                        tablaParticiones.splice((i+1),1);
                    }
                }
                if (exito2==true) {
                    tablaParticiones.splice(i,1);
                }
            }
            if ((i+1)<=tablaParticiones.length && exito==false) {
                const particion2 = tablaParticiones[i+1];
                if (particion2.estado==0) {//unir
                    particion.dirFin=particion2.dirFin;
                    particion.tamaño=particion.tamaño+particion2.tamano;
                    tablaParticiones.splice((i+1),1);
                }
            }
        }
        
    }
}

function add_cola_cpu(proceso) {
    var t_inicio=0; //tiempo de inicio en cola
    var t_fin=t_simulacion; //tiempo de fin en la cola
    var duracion= proceso.cicloVida[(proceso.posicion-1)];
    t_inicio=t_fin-duracion;
    var idProceso= proceso.idProceso;
    var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
    document.getElementById("cola_cpu").innerHTML+=`<div id='P${idProceso}' class="progress-bar" role="progressbar" style="width:20%">`+
   `<a data-trigger="hover" data-placement="bottom" data-original-title='Proceso ${idProceso}' data-toggle="popover" data-content= '${texto}'>P${idProceso} </a>` +'</div>';

}
function add_to_cpu(to_cpu) {
    if (to_cpu>0) {
        var t_inicio=t_simulacion-to_cpu; 
        var t_fin=t_simulacion; 
        var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
        document.getElementById("cola_cpu").innerHTML+='<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
        `<a data-trigger="hover" data-placement="bottom" data-original-title='Tiempo Ocioso' data-toggle="popover" data-content= '${texto}'> ** </a>` +'</div>';
    }
}
function add_to_es(to_es) {
    if (to_es>0) {
        var t_inicio=t_simulacion-to_es; 
        var t_fin=t_simulacion; 
        var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
        document.getElementById("cola_es").innerHTML+='<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
        `<a data-trigger="hover" data-placement="bottom" data-original-title='Tiempo Ocioso' data-toggle="popover" data-content= '${texto}'> ** </a>` +'</div>';
    }
}
function add_cola_es(proceso) {
    var t_inicio=0; //tiempo de inicio en cola
    var t_fin=t_simulacion; //tiempo de fin en la cola
    var duracion= proceso.cicloVida[(proceso.posicion-1)];
    t_inicio=t_fin-duracion;
    var idProceso= proceso.idProceso;
    var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
    document.getElementById("cola_es").innerHTML+=`<div id='P${idProceso}' class="progress-bar" role="progressbar" style="width:20%">`+
    `<a data-trigger="hover" data-placement="bottom" data-original-title='Proceso ${idProceso}' data-toggle="popover" data-content= '${texto}'>P${idProceso} </a>` +'</div>';
}
$(document).ready(function(){$('[data-toggle="popover"]').popover();});