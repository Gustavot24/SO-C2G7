var tablaParticiones = [];
var particion ={ //se crea el object
    "idParticion": 1,
    "dirInicio": 0,
    "dirFin": 99,
    "tamaño": 100,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
var particion ={ //se crea el object
    "idParticion": 2,
    "dirInicio": 100,
    "dirFin": 499,
    "tamaño": 500,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
var particion ={ //se crea el object
    "idParticion": 3,
    "dirInicio": 500,
    "dirFin": 699,
    "tamaño": 200,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
var particion ={ //se crea el object
    "idParticion": 4,
    "dirInicio": 700,
    "dirFin": 999,
    "tamaño": 300,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
var particion ={ //se crea el object
    "idParticion": 5,
    "dirInicio": 1000,
    "dirFin": 1599,
    "tamaño": 600,
    "estado": 0, //0 libre 1 ocupado
    "idProceso": null,
    "FI": 0,
};
tablaParticiones.push(particion);
console.log(tablaParticiones);
var tablaProcesos=[];
var proceso ={ //se crea el object
    "idProceso": 1,
    "prioridad": 1,
    "cicloVida": null,
    "tamaño": 212,
};
tablaProcesos.push(proceso);
var proceso ={ //se crea el object
    "idProceso": 2,
    "prioridad": 1,
    "cicloVida": null,
    "tamaño": 417,
};
tablaProcesos.push(proceso);
var proceso ={ //se crea el object
    "idProceso": 3,
    "prioridad": 1,
    "cicloVida": null,
    "tamaño": 112,
};
tablaProcesos.push(proceso);
var proceso ={ //se crea el object
    "idProceso": 4,
    "prioridad": 1,
    "cicloVida": null,
    "tamaño": 426,
};
tablaProcesos.push(proceso);

console.log(tablaProcesos);


function prueba() {
    var algoritmo=parseInt(prompt("1-FF   2-BF"));
    switch (algoritmo) {
        case 1:
            firstFit(tablaParticiones,tablaProcesos);
            break;
    
        default:
            bestFit(tablaParticiones,tablaProcesos);
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
                particioni.idProceso=i;
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
            particioni.idProceso=i;
            particioni.FI=fiactual;
            fiTotal=fiactual+fiTotal;
        }
    }
    console.log(fiTotal);
    console.log(tablaParticiones);
}