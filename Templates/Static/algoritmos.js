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
var tablaParticiones=[];
var tablaProcesos2=[];
var algoritmo=""; 
var tipoPart=""; 
var algoritmo2="";
var to_es=0; //tiempo oscioso e/s
var to_cpu=0; //tiempo oscioso cpu
var tamanoLibre= 0;
var direccionLibre = 0; 

//Algoritmo Prueba
function start(){
    tablaParticiones=condicionesInciales.tablaParticiones;
    tablaProcesos2=tablaProcesos;
    algoritmo2=colasMultinivel[0].algoritmo;
    algoritmo=condicionesInciales.algoritmo; 
    tipoPart=condicionesInciales.tipoParticion; 
    tamanoLibre= (condicionesInciales.tamanoMP-condicionesInciales.tamanoSO); 
    direccionLibre = condicionesInciales.tamanoSO; 
    document.getElementById("iniciar").disabled = true; 
    switch (algoritmo2) {
        case "SRTF":
            SRTF1();
        break;
        
        case "FCFS":
            FCFS_SJF1()
        break;

        case "SJF":
            FCFS_SJF1()
        break;
    }
}

function next(){
    switch (algoritmo2) {
        case "SRTF":
            SRTF2();
        break;
        
        case "FCFS":
            FCFS_SJF2()
        break;

        case "SJF":
            FCFS_SJF2()
        break;
    }
}

function FCFS_SJF1(){
    //Buscar un proceso donde TA=TSimulacion y agregarlo cola nuevo
    for (let i = 0; i < tablaProcesos.length; i++) {
        const element = tablaProcesos[i];
        if (element.tiempoArribo==t_simulacion) {
            cola_nuevo.push(element);
        }
    }
    llenarColasNuevo();
    document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+t_simulacion;
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
                    worstFitVble();
                break;
            }
            llenarMemoria();
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
                document.getElementById("usoDeCPU").innerHTML = "P"+proceso.idProceso;
            } else { //Si hay proceso ejecutando cpu
                if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                    var proceso = cola_listo[0];
                    add_cola_cpu(proceso, t_cpu);
                    proceso.posicion ++;
                    cola_cpu.shift();
                    document.getElementById("usoDeCPU").innerHTML = "Libre";
                    
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
                        llenarMemoria();                   
                        if (cola_nuevo.length>0) { //si significa que hay procesos para entrar a MP
                            exito=false;
                            continue agregarMP;                           
                        }                        
                    } else {//Termino de ejecutar cpu pasa a e/s
                        cola_bloqueado.push(proceso);
                        cola_listo.shift();
                    }                
                }else{exito=true;}
            }
        }else{to_cpu++;}     
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
                    if (cola_bloqueado.length>0 |cola_cpu.length==0) {exito=false;}
                    if (exito==true){to_es++;}                               
                }else{
                    if (cola_listo.length<=0 && cola_cpu.length==0){exito=true;} //si no, hay un proceso en cola, vuelvo arriba
                }
            }
        }else{to_es++;}
    } while (exito==false);
    t_simulacion ++;
    t_cpu --;
    t_es --;
    llenarColas();
}
function FCFS_SJF2(){
    if (cola_terminado.length < tablaProcesos.length) {
        //Buscar un proceso donde TA=TSimulacion y agregarlo cola nuevo
        for (let i = 0; i < tablaProcesos.length; i++) {
            const element = tablaProcesos[i];
            if (element.tiempoArribo==t_simulacion) {cola_nuevo.push(element);}
        }
        llenarColasNuevo();
        document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+t_simulacion;            
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
                        worstFitVble();
                    break;
                }
                llenarMemoria();
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
                    document.getElementById("usoDeCPU").innerHTML = "P"+proceso.idProceso;
                } else { //Si hay proceso ejecutando cpu
                    if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                        var proceso = cola_listo[0];
                        add_cola_cpu(proceso, t_cpu);
                        proceso.posicion ++;
                        cola_cpu.shift();
                        document.getElementById("usoDeCPU").innerHTML = "Libre";
                        
                        if (proceso.posicion==5) {//Termine de ejecutar el utlimo tiempo de cpu pasa a la cola terminado
                            cola_terminado.push(proceso);
                            cola_listo.shift();
                            exito = true;
                            idProceso=proceso.idProceso;
                            llenarTiempos(idProceso,t_simulacion);
                            htmlTags = `<div class="p-2 bg-white" id='CT${idProceso}'>P${idProceso}</div>`
                            $('#colaTerminado').append(htmlTags);
                            switch (tipoPart) {
                                case "F":
                                    quitar_MP(idProceso); //cuando termina de ejecutar su ciclo de vida. Debe ser eliminado de mp
                                break;                            
                                case "V":
                                    quitarVariable(idProceso);
                                break;                                
                            }  
                            llenarMemoria();                    
                            if (cola_nuevo.length>0) { //si significa que hay procesos para entrar a MP
                                exito=false;
                                continue agregarMP;                           
                            }                        
                        } else {//Termino de ejecutar cpu pasa a e/s
                            cola_bloqueado.push(proceso);
                            cola_listo.shift();
                        }                
                    }else{exito=true;}
                }
            }else{to_cpu++;}     
            //Asignar los procesos de la cola de bloqueados a la e/s
            if (cola_bloqueado.length>0) {
                if (cola_es.length==0) { //No hay procesos ejecutandose en es                                
                    add_to_es(to_es);
                    to_es=0;
                    var proceso = cola_bloqueado[0];
                    cola_es.push(proceso);
                    var i = proceso.posicion;
                    t_es = proceso.cicloVida[i];
                    document.getElementById("usoDeES").innerHTML = "P"+proceso.idProceso;                    
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
                        document.getElementById("usoDeES").innerHTML = "Libre";
                        if (cola_bloqueado.length>0 |cola_cpu.length==0){exito=false;}
                        if (exito==true){to_es++;}                               
                    }else{
                        if (cola_listo.length<=0 && cola_cpu.length==0){exito=true;}//si no, hay un proceso en cola, vuelvo arriba
                    }
                }
            }else{to_es++;}    
        } while (exito==false);    
        t_simulacion ++;
        t_cpu --;
        t_es --;
        llenarColas();
    } else {alert("Simulacion Terminada");}
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
            particioni.idProceso=(particioni.idProceso);
            particioni.FI=fiactual;
            fiTotal=fiactual+fiTotal;
            cola_listo.push(procesoi);
            cola_nuevo.splice(i,1);
            console.log(tablaParticiones);
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
function firstFitVble() {
    for (let i = 0; i < cola_nuevo.length; i++) {
        const proceso = cola_nuevo[i];
        var tamanoProceso=proceso.tamaño;
        if (tablaParticiones.length==0) { //no hay particiones
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
                cola_listo.push(proceso);
                cola_nuevo.splice(i,1);
            }
        } else {   //existen particiones. Busco si el proceso entra en alguna     
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
                            var dirFinActual=particion.dirFin;                    
                            var direccionFin=(particion.dirInicio+tamanoProceso-1);
                            particion.dirFin=direccionFin;
                            var idPart=particion.idParticion;
                            var k = tablaParticiones.length;
                            do {// corro las particiones. Incremento su id
                                const particion2 = tablaParticiones[(k-1)];
                                particion2.idParticion=(particion2.idParticion+1);
                                tablaParticiones.push(particion2);
                                tablaParticiones.splice((k-1),1);
                                k--;
                            } while (k>idPart);
                            var particion3 ={ //se crea el object
                                "idParticion": (idPart+1),
                                "dirInicio": (direccionFin+1),
                                "dirFin": dirFinActual,
                                "tamaño": diferencia,
                                "estado": 0, //0 libre 1 ocupado
                                "idProceso": null,
                                "FI": 0,
                            };
                            tablaParticiones.push(particion3);
                        break;
                    }
                    cola_listo.push(proceso);
                    cola_nuevo.splice(i,1);
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
                        "tamaño": proceso.tamaño,
                        "estado": 1, //0 libre 1 ocupado
                        "idProceso": proceso.idProceso,
                        "FI": 0,
                    };
                    tablaParticiones.push(particion3);
                    direccionLibre=direccionLibre+tamanoProceso;
                    tamanoLibre=tamanoLibre-tamanoProceso;
                    cola_listo.push(proceso);
                    cola_nuevo.splice(i,1);
                    
                } 
            }
        }
    }
}
function worstFitVble() {
    for (let i = 0; i < cola_nuevo.length; i++) {
        const proceso = cola_nuevo[i];
        var tamanoProceso=proceso.tamaño;
        if (tablaParticiones.length==0) { //Caso que no hay particiones= La memoria esta libre
            if (tamanoLibre>=tamanoProceso) {
                var idPart=0;
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
                cola_listo.push(proceso);
                cola_nuevo.splice(i,1);
            }
        } else {  //Caso que la memoria no esta libre. Hay particiones ocupadas o no     
            var fiactual=0;
            var exito2 = false;
            var j=0;
            do {            
                const particioni = tablaParticiones[j];
                if (exito2==false) {
                    if ((tamanoProceso<=particioni.tamaño) && (particioni.estado==0)) {
                        idpart=particioni.idParticion;
                        fiactual=(particioni.tamaño-tamanoProceso);
                        exito2=true;
                    }                     
                } else {
                    if ((tamanoProceso<=particioni.tamaño) && (particioni.estado==0)) {
                        var ficompara=(particioni.tamaño-tamanoProceso);
                        if (ficompara>fiactual) {
                            idpart=particioni.idParticion;
                            fiactual=ficompara;
                        }                    
                    }
                }
                j++;
            } while ( j<tablaParticiones.length);

            if (exito2==true) { //Caso que encontre una particion donde quepa el proceso
                idpart=idpart-1;
                const particioni = tablaParticiones[idpart];
                var tamanoPart=particioni.tamanoPart;               
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
                        var dirFinActual=particion.dirFin;                   
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
                            "dirFin": dirFinActual,
                            "tamaño": diferencia,
                            "estado": 0, //0 libre 1 ocupado
                            "idProceso": null,
                            "FI": 0,
                        };
                        tablaParticiones.push(particion3);
                    break;
                }
                cola_listo.push(procesoi);
                cola_nuevo.splice(i,1);
            }else{ //Caso que todas las particiones estan ocupadas creo una nueva
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
                    cola_listo.push(proceso);
                    cola_nuevo.splice(i,1);
                    
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
                    particion2.tamaño=particion2.tamaño+particion.tamaño;
                    exito2=true;
                }
                exito=true;
                if ((i+1)<tablaParticiones.length) {
                    const particion3 = tablaParticiones[i+1];
                    if (particion3.estado==0) {//unir
                        particion2.dirFin=particion3.dirFin;
                        particion2.tamaño=particion2.tamaño+particion3.tamaño;
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
                    particion.tamaño=particion.tamaño+particion2.tamaño;
                    tablaParticiones.splice((i+1),1);
                }
            }
        }
        
    }
}

function add_cola_cpu(proceso, t_cpu) {
    var t_inicio=0; //tiempo de inicio en cola
    var t_fin=t_simulacion; //tiempo de fin en la cola
    var duracion= proceso.cicloVida[(proceso.posicion)];
    if (duracion!=t_cpu) {
        var duracion= duracion-t_cpu;
    }
    t_inicio=t_fin-duracion;
    var idProceso= proceso.idProceso;
    var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
    document.getElementById("cola_cpu").innerHTML+=`<div id='P${idProceso}' class="progress-bar" role="progressbar" style="width:20%">`+
   `<a data-trigger="hover" data-placement="bottom" data-original-title='Proceso ${idProceso}' data-toggle="popover" data-content= '${texto}'>P${idProceso} </a>` +'</div>';
   $('[data-toggle="popover"]').popover();
}
function add_to_cpu(to_cpu) {
    if (to_cpu>0) {
        var t_inicio=t_simulacion-to_cpu; 
        var t_fin=t_simulacion; 
        var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
       document.getElementById("cola_cpu").innerHTML+='<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
      `<a data-trigger="hover" data-placement="bottom" data-original-title='Tiempo Ocioso' data-toggle="popover" data-content= '${texto}'> ** </a>` +'</div>';
      $('[data-toggle="popover"]').popover();
    }
}
function add_to_es(to_es) {
    if (to_es>0) {
        var t_inicio=t_simulacion-to_es; 
        var t_fin=t_simulacion; 
        var texto= 'Desde: '+ t_inicio.toString() + ' Hasta: ' + t_fin.toString();
       document.getElementById("cola_es").innerHTML+='<div id="warning" class="progress-bar" role="progressbar" style="width:20%">'+
       `<a data-trigger="hover" data-placement="bottom" data-original-title='Tiempo Ocioso' data-toggle="popover" data-content= '${texto}'> ** </a>` +'</div>';
       $('[data-toggle="popover"]').popover();
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
    $('[data-toggle="popover"]').popover();
}
$(function () {$('[data-toggle="popover"]').popover()});
function llenarColas() {
    $('#colaListo').empty();
    $('#colaBloqueado').empty();
    for (let i = 0; i < cola_listo.length; i++) {
        const element = cola_listo[i];
        htmlTags = `<div class="p-2 bg-white" id='CL${element.idProceso}'>P${element.idProceso}</div>`
        $('#colaListo').append(htmlTags);
    }
    for (let i = 0; i < cola_bloqueado.length; i++) {
        const element = cola_bloqueado[i];
        htmlTags = `<div class="p-2 bg-white" id='CB${element.idProceso}'>P${element.idProceso}</div>`
        $('#colaBloqueado').append(htmlTags);
    }
}
function llenarColasNuevo() {
    $('#colaNuevo').empty();
    for (let i = 0; i < cola_nuevo.length; i++) {
        const element = cola_nuevo[i];
        htmlTags = `<div class="p-2 bg-white" id='CN${element.idProceso}'>P${element.idProceso}</div>`
        $('#colaNuevo').append(htmlTags);
    }
}
function llenarMemoria() {
    $('#divMemoria').empty();
    var texto= "Dir Inicio: 0"+
    `  Dir Fin: ${(condicionesInciales.tamanoSO)-1}  `+
    `  Tamaño: ${condicionesInciales.tamanoSO}  `;
    htmlTags='<div class="p-2 bg-white">'+
    `<a data-trigger="hover" data-placement="bottom" data-original-title='SO' data-toggle="popover" data-content= '${texto}'>SO</a>` +
    '</div>';
    $('#divMemoria').append(htmlTags);
    for (let i = 0; i < tablaParticiones.length; i++) {
        const particion = tablaParticiones[i];
        if (particion.estado==1) {
            //htmlTags=`<div class="p-2 bg-white">P${particion.idProceso}</div>`
            var texto= "Dir Inicio:"+`${particion.dirInicio}  `+
            `  Dir Fin: ${particion.dirFin}  `+
            `  Tamaño: ${particion.tamaño}  `+
            `  Fragm Interna: ${particion.FI}  `;
            htmlTags='<div class="p-2 bg-white">'+
            `<a data-trigger="hover" data-placement="bottom" data-original-title='Particion #${particion.idParticion}' data-toggle="popover" data-content= '${texto}'>P${particion.idProceso}</a>` +
            '</div>';
            $('#divMemoria').append(htmlTags);
        } else {
            var texto= "Dir Inicio:"+`${particion.dirInicio}  `+
            `  Dir Fin: ${particion.dirFin}  `+
            `  Tamaño: ${particion.tamaño}  `;
            htmlTags='<div class="p-2 bg-white">'+
            `<a data-trigger="hover" data-placement="bottom" data-original-title='Particion #${particion.idParticion}' data-toggle="popover" data-content= '${texto}'>Libre</a>` +
            '</div>';
            $('#divMemoria').append(htmlTags);
        }
        
    }
    $(function () {$('[data-toggle="popover"]').popover()});
}
function llenarTiempos(id,t_fin) {
    for (let i = 0; i < tablaProcesos2.length; i++) {
        const proceso = tablaProcesos2[i];
        if (proceso.idProceso==id) {
            var t_irrupcion=proceso.cicloVida[0]+proceso.cicloVida[2]+proceso.cicloVida[4];
            var arribo=proceso.tiempoArribo;
            var retorno=t_fin-arribo;
            var espera=retorno-t_irrupcion;
        }
    }    
    var htmlTags = '<tr>'+
    '<td>' + `P${id}` + '</td>'+
    '<td>' + `${t_fin}` + '</td>'+
    '<td>' + `${arribo}` + '</td>'+
    '<td>' +`${retorno}` + '</td>'+ '</tr>';       
    $('#tablaRetorno tbody').append(htmlTags);
    var htmlTags = '<tr>'+
    '<td>' + `P${id}` + '</td>'+
    '<td>' + `${retorno}` + '</td>'+
    '<td>' + `${t_irrupcion}` + '</td>'+
    '<td>' +`${espera}` + '</td>'+ '</tr>';       
    $('#tablaEspera tbody').append(htmlTags);
}

function SRTF1(){    
    //Buscar un proceso donde TA=TSimulacion y agregarlo cola nuevo
    for (let i = 0; i < tablaProcesos.length; i++) {
        const element = tablaProcesos[i];
        if (element.tiempoArribo==t_simulacion) {
            cola_nuevo.push(element);
        }
    }
    llenarColasNuevo();
    document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+t_simulacion;
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
                    worstFitVble();
                break;
            }
            llenarMemoria();
        }
        //Asignar los procesos de la cola listo a la cpu
        if (cola_listo.length>0) { //Primero pregunto si la cola contiene algun proceso.
            if (cola_cpu.length==0) { //No hay procesos ejecutandose en cpu
                var pos=0;     
                if (cola_listo.length>1 && algoritmo2=="SRTF") {//Busco aquel proceso con el ciclo de vida mas corto
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
                document.getElementById("usoDeCPU").innerHTML = "P"+proceso.idProceso;
            } else { //Si hay proceso ejecutando cpu
                if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                    var proceso = cola_cpu[0];
                    add_cola_cpu(proceso, t_cpu);
                    proceso.posicion ++;
                    cola_cpu.shift();
                    document.getElementById("usoDeCPU").innerHTML = "Libre";
                    
                    if (proceso.posicion==5) {//Termine de ejecutar el utlimo tiempo de cpu pasa a la cola terminado
                        cola_terminado.push(proceso);
                        var index = cola_listo.indexOf(proceso);
                        cola_listo.splice(index,1);
                        exito = true;
                        idProceso=proceso.idProceso;
                        llenarTiempos(idProceso,t_simulacion);
                        htmlTags = `<div class="p-2 bg-white" id='CT${idProceso}'>P${idProceso}</div>`
                        $('#colaTerminado').append(htmlTags);
                        switch (tipoPart) {
                            case "F":
                                quitar_MP(idProceso); //cuando termina de ejecutar su ciclo de vida. Debe ser eliminado de mp
                            break;                            
                            case "V":
                                quitarVariable(idProceso);
                            break;                                
                        }  
                        llenarMemoria();                    
                        if (cola_nuevo.length>0) { //si significa que hay procesos para entrar a MP
                            exito=false;
                            continue agregarMP;                           
                        } 
                        if (cola_listo.length>0 && cola_cpu.length==0){exito=false;}                      
                    } else {//Termino de ejecutar cpu pasa a e/s
                        cola_bloqueado.push(proceso);
                        var index = cola_listo.indexOf(proceso);
                        cola_listo.splice(index,1);
                    }                
                }else{ //Hay algun proceso en CPU pero no termino. Pregunto si hay otro con menor tiempo para entrar
                    var pos=0;                    
                    if (cola_listo.length>1 && algoritmo2=="SRTF") { //pregunta si hay dos procesos en la cola de listo
                        var exito2 =false;
                        var irrupcion_cpu =t_cpu;
                        for (let k = 0; k < cola_listo.length; k++) {
                            const proceso = cola_listo[k];
                            var posicion=proceso.posicion;
                            var duracion=proceso.cicloVida[posicion];
                            var idProc=proceso.idProceso;
                            var idProc2=cola_cpu[0].idProceso;
                            var pos2=cola_cpu[0].posicion;
                            if (idProc!=idProc2 && duracion<irrupcion_cpu) {
                                irrupcion_cpu=duracion;
                                pos=k;
                                exito2=true;
                            }
                        }
                        if (exito2==true) { //significa que el proceso que esta en cpu tiene que salir porq hay otro que tiene el TI mas pequeño
                            var proceso = cola_cpu[0];
                            var index = tablaProcesos.indexOf(proceso);
                            add_cola_cpu(proceso, t_cpu);
                            tablaProcesos[index].cicloVida[pos2]=t_cpu;
                            
                            proceso = cola_listo[pos];
                            cola_cpu.shift();
                            cola_cpu.push(proceso);
                            t_cpu = irrupcion_cpu;                                
                            document.getElementById("usoDeCPU").innerHTML = "P"+proceso.idProceso;
                        }                        
                    } 
                    exito = true; //para salir del ciclo 
                }
            }
        }else{to_cpu++;}     
        //Asignar los procesos de la cola de bloqueados a la e/s
        if (cola_bloqueado.length>0) {
            if (cola_es.length==0) { //No hay procesos ejecutandose en es             
                add_to_es(to_es);
                to_es=0;
                var proceso = cola_bloqueado[0];
                cola_es.push(proceso);
                var i = proceso.posicion;
                t_es = proceso.cicloVida[i];
                document.getElementById("usoDeES").innerHTML = "P"+proceso.idProceso;                    
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
                    document.getElementById("usoDeES").innerHTML = "Libre";
                    if (cola_bloqueado.length>0 |cola_cpu.length==0){exito=false;}
                    if (exito==true){to_es++;}                               
                }else{
                    
                    if (cola_listo.length<=0 && cola_cpu.length==0){exito=true;}//si no, hay un proceso en cola, vuelvo arriba
                }
            }
        }else{to_es++;}    
    } while (exito==false);   
    t_simulacion ++;
    t_cpu --;
    t_es --;
    llenarColas();
}

function SRTF2(){
    if (cola_terminado.length < tablaProcesos.length) {
        //Buscar un proceso donde TA=TSimulacion y agregarlo cola nuevo
        for (let i = 0; i < tablaProcesos.length; i++) {
            const element = tablaProcesos[i];
            if (element.tiempoArribo==t_simulacion) {cola_nuevo.push(element);}
        }
        llenarColasNuevo();
        document.getElementById("tiempoActual").innerHTML = "Tiempo Actual: "+t_simulacion;            
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
                        worstFitVble();
                    break;
                }
                llenarMemoria();
            }
            //Asignar los procesos de la cola listo a la cpu
            if (cola_listo.length>0) { //Primero pregunto si la cola contiene algun proceso.
                if (cola_cpu.length==0) { //No hay procesos ejecutandose en cpu
                    var pos=0;     
                    if (cola_listo.length>1 && algoritmo2=="SRTF") {//Busco aquel proceso con el ciclo de vida mas corto
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
                    document.getElementById("usoDeCPU").innerHTML = "P"+proceso.idProceso;
                } else { //Si hay proceso ejecutando cpu
                    if (t_cpu==0) { //Pregunto si termino de ejecutar su tiempo de cpu
                        var proceso = cola_cpu[0];
                        add_cola_cpu(proceso, t_cpu);
                        proceso.posicion ++;
                        cola_cpu.shift();
                        document.getElementById("usoDeCPU").innerHTML = "Libre";
                        
                        if (proceso.posicion==5) {//Termine de ejecutar el utlimo tiempo de cpu pasa a la cola terminado
                            cola_terminado.push(proceso);
                            var index = cola_listo.indexOf(proceso);
                            cola_listo.splice(index,1);
                            exito = true;
                            idProceso=proceso.idProceso;
                            llenarTiempos(idProceso,t_simulacion);
                            htmlTags = `<div class="p-2 bg-white" id='CT${idProceso}'>P${idProceso}</div>`
                            $('#colaTerminado').append(htmlTags);
                            switch (tipoPart) {
                                case "F":
                                    quitar_MP(idProceso); //cuando termina de ejecutar su ciclo de vida. Debe ser eliminado de mp
                                break;                            
                                case "V":
                                    quitarVariable(idProceso);
                                break;                                
                            }  
                            llenarMemoria();                    
                            if (cola_nuevo.length>0) { //si significa que hay procesos para entrar a MP
                                exito=false;
                                continue agregarMP;                           
                            } 
                            if (cola_listo.length>0 && cola_cpu.length==0){exito=false;}                      
                        } else {//Termino de ejecutar cpu pasa a e/s
                            cola_bloqueado.push(proceso);
                            var index = cola_listo.indexOf(proceso);
                            cola_listo.splice(index,1);
                        }                
                    }else{ //Hay algun proceso en CPU pero no termino. Pregunto si hay otro con menor tiempo para entrar
                        var pos=0;                    
                        if (cola_listo.length>1 && algoritmo2=="SRTF") { //pregunta si hay dos procesos en la cola de listo
                            var exito2 =false;
                            var irrupcion_cpu =t_cpu;
                            for (let k = 0; k < cola_listo.length; k++) {
                                const proceso = cola_listo[k];
                                var posicion=proceso.posicion;
                                var duracion=proceso.cicloVida[posicion];
                                var idProc=proceso.idProceso;
                                var idProc2=cola_cpu[0].idProceso;
                                var pos2=cola_cpu[0].posicion;
                                if (idProc!=idProc2 && duracion<irrupcion_cpu) {
                                    irrupcion_cpu=duracion;
                                    pos=k;
                                    exito2=true;
                                }
                            }
                            if (exito2==true) { //significa que el proceso que esta en cpu tiene que salir porq hay otro que tiene el TI mas pequeño
                                var proceso = cola_cpu[0];
                                var index = tablaProcesos.indexOf(proceso);
                                add_cola_cpu(proceso, t_cpu);
                                tablaProcesos[index].cicloVida[pos2]=t_cpu;
                                
                                proceso = cola_listo[pos];
                                cola_cpu.shift();
                                cola_cpu.push(proceso);
                                t_cpu = irrupcion_cpu;                                
                                document.getElementById("usoDeCPU").innerHTML = "P"+proceso.idProceso;
                            }                        
                        } 
                        exito = true; //para salir del ciclo 
                    }
                }
            }else{to_cpu++;}     
            //Asignar los procesos de la cola de bloqueados a la e/s
            if (cola_bloqueado.length>0) {
                if (cola_es.length==0) { //No hay procesos ejecutandose en es             
                    add_to_es(to_es);
                    to_es=0;
                    var proceso = cola_bloqueado[0];
                    cola_es.push(proceso);
                    var i = proceso.posicion;
                    t_es = proceso.cicloVida[i];
                    document.getElementById("usoDeES").innerHTML = "P"+proceso.idProceso;                    
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
                        document.getElementById("usoDeES").innerHTML = "Libre";
                        if (cola_bloqueado.length>0 |cola_cpu.length==0){exito=false;}
                        if (exito==true){to_es++;}                               
                    }else{
                        
                        if (cola_listo.length<=0 && cola_cpu.length==0){exito=true;}//si no, hay un proceso en cola, vuelvo arriba
                    }
                }
            }else{to_es++;}    
        } while (exito==false);    
        t_simulacion ++;
        t_cpu --;
        t_es --;
        llenarColas();
    } else {alert("Simulacion Terminada");}
}