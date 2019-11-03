//Pestaña:Carga de condiciones iniciales


//Esto es para el slider que muestra el porcentaje del SO
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
slider.oninput = function() {
    //var tamanoMP = document.getElementById("mp").value;
    //var tamanoSO = Math.ceil(tamanoMP* ((this.value)/100));
    //output.innerHTML = tamanoSO;
    output.innerHTML = this.value;
}

//Funcion para setear visibilidad de los botones
function setVisible() {
    document.getElementById("div-particiones").style.visibility="visible";
    document.getElementById("boton1").disabled=true; 
    document.getElementById("boton2").disabled=true;
    document.getElementById("boton3").disabled=true;
    document.getElementById("boton4").style.visibility="visible";
}

//Object que contine todos los datos ingresados por el usuario en cuanto a las
//condiciones iniciales
var condicionesInciales ={ 
    "tamanoMP": null,
    "porcentajeSO": null,
    "tamanoSO": null,
    "tipoParticion": null,
    "algoritmo": null, 
    "tablaParticiones": [],
};

//Variables globales
var idPart=1;
var direccionLibre=0;
var tamanoLibre =0;

//Funcion que carga en el object los datos para las particiones de distintos tamaños. 
//Cuando presiona el boton Agregar Particiones Manualmente
function cargarParticionesVbles() {
    //Carga los datos: tipo de particion y algortimo
    if($('#prtfixed').is(':checked')) { condicionesInciales.tipoParticion="F" }
    if($('#prtvar').is(':checked')) { condicionesInciales.tipoParticion="V"  }
    if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="F"}
    if($('#wrtfit').is(':checked')) { condicionesInciales.algoritmo="W"}
    if($('#bstfit').is(':checked')) { condicionesInciales.algoritmo="B" }
    
    //La primera vez realiza calculos necesarios para dsps (tamanoLibre, direccionLibre, etc)
    if (idPart==1) {
        var tamanoMP =parseInt(document.getElementById("mp").value);
        var porcentaje =parseInt(document.getElementById("myRange").value)/100;
        var tamanoSO = Math.ceil(tamanoMP* porcentaje);
        tamanoLibre= tamanoMP-tamanoSO;
        direccionLibre = tamanoSO;
        condicionesInciales.tamanoMP=tamanoMP;
        condicionesInciales.porcentajeSO=porcentaje;
        condicionesInciales.tamanoSO=tamanoSO;
    } 

    //Carga la particion en el array tabla de particiones que es parte del object
    var tamano = parseInt(document.getElementById(`tamano${idPart}`).value);
    if (tamano <= tamanoLibre) {
        var dirfin= direccionLibre+tamano-1;
        tamanoLibre = tamanoLibre-tamano;
        x=document.getElementById('tabla-particiones').rows[parseInt(idPart,10)].cells;
        x[parseInt(0,10)].innerHTML=idPart;
        x[parseInt(1,10)].innerHTML=direccionLibre;
        x[parseInt(2,10)].innerHTML=dirfin;
        x[parseInt(3,10)].innerHTML=tamano;
        var particion ={ //se crea el object
            "idParticion": idPart,
            "dirInicio": direccionLibre,
            "dirFin": dirfin,
            "tamaño": tamano,
            "estado": 0, //0 libre 1 ocupado
            "idProceso": null,
            "FI": 0,
        };
        condicionesInciales.tablaParticiones.push(particion);
        idPart++;
        direccionLibre = (dirfin+1);
        if (tamanoLibre == 0) {
            mostrarMensaje("errorCondicionesIniciales", "No hay mas espacio disponible");
            document.getElementById("boton5").style.visibility="visible";
            document.getElementById("boton4").style.visibility="hidden";
        }else{
            var htmlTags = '<tr>'+
                '<td>' + "#" + '</td>'+
                '<td>' + "#" + '</td>'+
                '<td>' + "#" + '</td>'+
                '<td>' + `<input type="text" class="form-control" id='tamano${idPart}' placeholder="Ingrese tamaño"></input>` 
                + '</td>'+ '</tr>';       
            $('#tabla-particiones tbody').append(htmlTags);
        }
    } else {
        mostrarMensaje("errorCondicionesIniciales", "El tamaño ingresado supera el tamaño disponible: " + tamanoLibre);
        
    }
    console.log(condicionesInciales);
}

//Funcion que permite cargar el object cuando las particiones son del mismo tamaño.
//Cuando el usuario presiona el boton Agregar Particione iguales.
function cargarParticionesFijas() {
    document.getElementById("boton1").disabled=true;
    document.getElementById("boton2").disabled=true;
    document.getElementById("boton3").disabled=true;
    document.getElementById("boton4").style.visibility="hidden";
    if($('#prtfixed').is(':checked')) { condicionesInciales.tipoParticion="F" }
    if($('#prtvar').is(':checked')) { condicionesInciales.tipoParticion="V"  }
    if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="F"}
    if($('#wrtfit').is(':checked')) { condicionesInciales.algoritmo="W"}
    if($('#bstfit').is(':checked')) { condicionesInciales.algoritmo="B" }
    var tamanoMP = parseInt(document.getElementById("mp").value);
    var porcentaje =parseInt(document.getElementById("myRange").value)/100;
    var tamanoSO = Math.ceil(tamanoMP* porcentaje);
    condicionesInciales.tamanoMP=tamanoMP;
    condicionesInciales.porcentajeSO=porcentaje;
    condicionesInciales.tamanoSO=tamanoSO;
    tamanoLibre= tamanoMP-tamanoSO;
    direccionLibre = tamanoSO;
    var cantParticiones =parseInt(document.getElementById("cantpart").value);
    var tamanoParticion =parseInt(document.getElementById("tamanopart").value);

    for (let i = 0; i < cantParticiones; i++) {
        var dirfin= direccionLibre+tamanoParticion-1;
        tamanoLibre = tamanoLibre-tamanoParticion;
        x=document.getElementById('tabla-particiones').rows[parseInt(idPart,10)].cells;
        x[parseInt(0,10)].innerHTML=idPart;
        x[parseInt(1,10)].innerHTML=direccionLibre;
        x[parseInt(2,10)].innerHTML=dirfin;
        x[parseInt(3,10)].innerHTML=tamanoParticion;
        var particion ={ //se crea el object
            "idParticion": idPart,
            "dirInicio": direccionLibre,
            "dirFin": dirfin,
            "tamaño": tamanoParticion,
            "estado": 0, //0 libre 1 ocupado
            "idProceso": null,
            "FI": 0,
        };
        condicionesInciales.tablaParticiones.push(particion);
        idPart++;
        direccionLibre = (dirfin+1);
        if ((i+1)==cantParticiones) {
            
        }else{
        var htmlTags = '<tr>'+
            '<td>' + "#" + '</td>'+
            '<td>' + "#" + '</td>'+
            '<td>' + "#" + '</td>'+
            '<td>' + `<input type="text" class="form-control" id='tamano${idPart}' placeholder="Ingrese tamaño"></input>` 
            + '</td>'+ '</tr>';       
            $('#tabla-particiones tbody').append(htmlTags);
        }
    }  
    $("#addprt").modal('hide');
    document.getElementById("div-particiones").style.visibility="visible";
    document.getElementById("boton5").style.visibility="visible";
    console.log(condicionesInciales);
}
