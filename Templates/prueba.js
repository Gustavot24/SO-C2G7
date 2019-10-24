//algoritmos de asignacion de procesos a memoria
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
    "cicloVida": 5,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 2,
    "tamaño": 20,
    "prioridad": 1,
    "tiempoArribo": 0,
    "cicloVida": 4,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 3,
    "tamaño": 12,
    "prioridad": 1,
    "tiempoArribo": 0,
    "cicloVida": 10,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 4,
    "tamaño": 5,
    "prioridad": 1,
    "tiempoArribo": 1,
    "cicloVida": 3,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 5,
    "tamaño": 3,
    "prioridad": 1,
    "tiempoArribo": 2,
    "cicloVida": 2,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 6,
    "tamaño": 70,
    "prioridad": 1,
    "tiempoArribo": 3,
    "cicloVida": 10,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 7,
    "tamaño": 25,
    "prioridad": 1,
    "tiempoArribo": 4,
    "cicloVida": 5,
};
tablaProcesos.push(proceso);
var proceso = {
    "idProceso": 8,
    "tamaño": 10,
    "prioridad": 1,
    "tiempoArribo": 5,
    "cicloVida": 5,
};
tablaProcesos.push(proceso);
console.log(tablaProcesos);

var tTotalIrrupcion = 0;
for (let i = 0; i < tablaProcesos.length; i++) {
    const element = tablaProcesos[i];
    tTotalIrrupcion = tTotalIrrupcion + parseInt(element.cicloVida);
}
tiempoSimulacion=0;
var bandera =true;
var colaListo =[];
var colaEjecutando =[];
function prueba() {
    document.getElementById("resultados").style.display ="";
    if (bandera == true) {
        var htmlTags = '<tr>' + ' <td>MP</td>' + '<td>SO (32K)</td>' + '<td>P1 (6K)</td>' +
            '<td>P2 (20K)</td>' + '<td>P3 (70K)</td>' + '<td>t=0</td>' + '</tr>';
        $('#tabla-particion tbody').append(htmlTags);
        bandera = false;
    }
    for (let i = 0; i < tablaProcesos.length; i++) {
        const element = tablaProcesos[i];
        if ((element.tiempoArribo)==tiempoSimulacion) {
            var idParti=firstfit(element); //busca si hay alguna particion disponible para asignar
            if (idParti==0) {
                console.log("no hay particiones");
            } else {
                colaListo.push(element);
                switch (idParti) {
                    case 0:
                        var htmlTags = '<tr>' + ' <td>MP</td>' + '<td>SO (32K)</td>' + '<td>Pr'+ (i+1) +'</td>' +
                        '<td></td>' + '<td></td>' + '<td>t=0</td>' + '</tr>';
                        $('#tabla-particion tbody').append(htmlTags);
                        break;
                    case 1:
                        var htmlTags = '<tr>' + ' <td>MP</td>' + '<td>SO (32K)</td>' + '<td></td>' +
                        '<td>Pr'+ (i+1) +'</td>' + '<td></td>' + '<td>t=0</td>' + '</tr>';
                        $('#tabla-particion tbody').append(htmlTags);
                        break;
                    case 2:
                        var htmlTags = '<tr>' + ' <td>MP</td>' + '<td>SO (32K)</td>' + '<td></td>' +
                        '<td></td>' + '<td>Pr'+ (i+1) +'</td>' + '<td>t=0</td>' + '</tr>';
                        $('#tabla-particion tbody').append(htmlTags);
                        break;
                    default:
                        break;
                }
            }
        } else {
            
        }
    }
    /*
    do {
        if (tiempoSimulacion == 0) {
            var htmlTags = '<tr>' + ' <td>MP</td>' + '<td>SO (32K)</td>' + '<td>P1 (6K)</td>' +
                '<td>P2 (20K)</td>' + '<td>P3 (70K)</td>' + '<td>t=0</td>' + '</tr>';
            $('#tabla-particion tbody').append(htmlTags);
        }
        tiempoSimulacion= tiempoSimulacion-1;
    } while (tiempoSimulacion > 0);
    */
    
}
function firstfit(element) {
    var exito= false;
    var idParti =0;
    var i =0;
    do {
        
        const element1 = tablaParticiones[i];
        if ((element1.tamaño > element.tamaño)&&(element1.estado==0)) {
            exito=true;
            idParti=(i);
            element1.estado=1;
            element1.idProceso=element.idProceso;
            element1.FI=(element1.tamaño-element.tamaño);
        }
        i ++;
    } while ((exito == false) && (i < tablaParticiones.length));
    if (exito == true) {
        return idParti;
    } else {
        return 0;
    }
}
/*
function prueba() {
    var algoritmo=parseInt(prompt("1-FF   2-BF   3-WF"));
    switch (algoritmo) {
        case 1:
            firstFit(tablaParticiones,tablaProcesos);
            break;
        case 2:
            bestFit(tablaParticiones,tablaProcesos);
            break;
        default:
            worstFit(tablaParticiones,tablaProcesos);
            break;
    }
}

function firstFit(tablaParticiones,tablaProcesos) {
    var fiTotal=0;
    for (let i = 0; i < tablaProcesos.length; i++) {
        const procesoi = tablaProcesos[i];
        var exito = false;
        var j=0;
        do {
            
            const particioni = tablaParticiones[j];
            if ((procesoi.tamaño<=particioni.tamaño) && (particioni.estado==0)) {
                particioni.estado=1;
                particioni.idProceso=(i+1);
                particioni.FI=(particioni.tamaño-procesoi.tamaño);
                exito=true;
                fiTotal=particioni.FI+fiTotal;
            } 
            j++;
        } while (exito==false && j<tablaParticiones.length);
    }
    console.log(fiTotal);
    console.log(tablaParticiones);
}

function bestFit(tablaParticiones,tablaProcesos) {
    var fiTotal=0;    
    var idpart=0;
    for (let i = 0; i < tablaProcesos.length; i++) {
        const procesoi = tablaProcesos[i];
        var fiactual=0;
        //var exito = false;
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
        }
    }
    console.log(fiTotal);
    console.log(tablaParticiones);
}

function worstFit(tablaParticiones,tablaProcesos) {
    var fiTotal=0;    
    var idpart=0;
    for (let i = 0; i < tablaProcesos.length; i++) {
        const procesoi = tablaProcesos[i];
        var fiactual=0;
        //var exito = false;
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
                    if (ficompara>fiactual) {
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
        }
    }
    console.log(fiTotal);
    console.log(tablaParticiones);
}
*/