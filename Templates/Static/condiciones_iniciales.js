//Pestaña:Carga de condiciones iniciales

// variable que controla si se guardaron las particiones
var seGuardaronLasParticiones = false;

//Esto es para el slider que muestra el porcentaje del SO
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
var cargando1 = false; //Variable booleana para saber si se están cargando los datos de un nuevo proceso
var editando1 = false; //Variable booleana para saber si se están editando los datos un proceso 
var anulado1 = false;
//Object que contine todos los datos ingresados por el usuario en cuanto a las
//condiciones iniciales
var condicionesInciales = { 
    "tamanoMP": null,
    "porcentajeSO": null,
    "tamanoSO": null,
    "tipoParticion": null,
    "algoritmo": null, 
    "tablaParticiones": [],
};

//Variables globales
var idPart = 1;
var direccionLibre = 0;
var tamanoLibre = 0; //contiene la suma de tamaños libres

slider.oninput = function() {
    //var tamanoMP = document.getElementById("mp").value;
    //var tamanoSO = Math.ceil(tamanoMP* ((this.value)/100));
    //output.innerHTML = tamanoSO;
    output.innerHTML = this.value;
    seGuardaronLasParticiones = false;
}

document.getElementById("frtfit").on
//Funcion para setear visibilidad de los botones
function setVisible() {
    //Carga los datos: tipo de particion y algortimo
    $("#tabla-particiones tbody").empty();
    if($('#prtfixed').is(':checked')) { //F de fija
        condicionesInciales.tipoParticion="F" 
        if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="FF"} //FF Firstfit para fija
        if($('#bstfit').is(':checked')) { condicionesInciales.algoritmo="B"}
    }
    if($('#prtvar').is(':checked')) { //V es de variable
        condicionesInciales.tipoParticion="V"  
        if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="FV"} //FV Firstfit para variable
        if($('#wrtfit').is(':checked')) { condicionesInciales.algoritmo="W"}
    }
    document.getElementById("mp").disabled = true; // deshabilita el number de tamaño de memoria para no hacer cagadas
    document.getElementById("myRange").disabled = true; // deshabilita el range de tamaño de SO para no hacer cagadas
    //La primera vez realiza calculos necesarios para dsps (tamanoLibre, direccionLibre, etc)
    var tamanoMP =parseInt(document.getElementById("mp").value);
    var porcentaje =parseInt(document.getElementById("myRange").value)/100;
    var tamanoSO = Math.ceil(tamanoMP* porcentaje);
    tamanoLibre= tamanoMP-tamanoSO;
    direccionLibre = tamanoSO;
    condicionesInciales.tamanoMP=tamanoMP;
    condicionesInciales.porcentajeSO=porcentaje;
    condicionesInciales.tamanoSO=tamanoSO;

    var particion ={ //se crea el object Esapacio Libre
        "idParticion": 0,
        "dirInicio": direccionLibre,
        "dirFin": (tamanoMP-1),
        "tamaño": tamanoLibre,
        "estado": 0, //0 libre 1 ocupado
        "idProceso": null,
        "FI": 0,
    };
    condicionesInciales.tablaParticiones.push(particion);
    doGraphichs();

    document.getElementById("div-particiones").style.visibility = "visible";
    //document.getElementById("boton1").disabled = true; 
    //document.getElementById("boton2").disabled = true;
    document.getElementById("boton3").disabled = true;
    document.getElementById("boton4").style.visibility = "visible";
    var htmlTags = '<tr id="'+idPart+'">'+
                '<td>' + "#" + '</td>'+
                '<td>' + "#" + '</td>'+
                '<td>' + "#" + '</td>'+
                '<td>' + `<input type="text" class="form-control" id='tamano${idPart}' placeholder="Ingrese tamaño"></input>` 
                + '</td>'+ '<td id="opciones'+idPart+'">'+
                '<button class="btn btn-outline-dark" id="save'+idPart+'" style="display:block" onclick="guardarPart()">'+'<i class="material-icons align-middle">save</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel'+idPart+'" style="display:block" onclick="anularPart()">'+'<i class="material-icons align-middle">highlight_off</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="edit'+idPart+'" style="display:none" onclick="edit(this)">'+'<i class="material-icons align-middle">create</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="delete'+idPart+'" style="display:none" onclick="delete(this)">'+'<i class="material-icons align-middle">delete_outline</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel2'+idPart+'" style="display:none" onclick="des(this)">'+'<i class="material-icons align-middle">undo</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="acept'+idPart+'" style="display:none" onclick="acept(this)">'+'<i class="material-icons align-middle">done_outline</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel3'+idPart+'" style="display:none" onclick="cancel()">'+'<i class="material-icons align-middle">close</i>'+'</button>'+
                '</td>'+ '</tr>';       
    $('#tabla-particiones tbody').append(htmlTags);
    $(function () {$('[data-toggle="popover"]').popover()});
    cargando1=true;
}

function nuevaPart() {
    if (cargando1==false && editando1==false) {
        if (tamanoLibre == 0) {
            mostrarMensaje("errorCondicionesIniciales", "No hay mas espacio disponible");
            document.getElementById("boton5").style.visibility="visible";
            document.getElementById("boton4").style.visibility="hidden";
        }else{
            var htmlTags = '<tr id="'+idPart+'">'+
                '<td>' + "#" + '</td>'+
                '<td>' + "#" + '</td>'+
                '<td>' + "#" + '</td>'+
                '<td>' + `<input type="text" class="form-control" id='tamano${idPart}' placeholder="Ingrese tamaño"></input>` 
                + '</td>'+ '<td id="opciones'+idPart+'">'+
                '<button class="btn btn-outline-dark" id="save'+idPart+'" style="display:block" onclick="guardarPart()">'+'<i class="material-icons align-middle">save</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel'+idPart+'" style="display:block" onclick="anularPart()">'+'<i class="material-icons align-middle">highlight_off</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="edit'+idPart+'" style="display:none" onclick="edit(this)">'+'<i class="material-icons align-middle">create</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="delete'+idPart+'" style="display:none" onclick="delete(this)">'+'<i class="material-icons align-middle">delete_outline</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel2'+idPart+'" style="display:none" onclick="des(this)">'+'<i class="material-icons align-middle">undo</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="acept'+idPart+'" style="display:none" onclick="acept(this)">'+'<i class="material-icons align-middle">done_outline</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel3'+idPart+'" style="display:none" onclick="cancel()">'+'<i class="material-icons align-middle">close</i>'+'</button>'+
                '</td>'+ '</tr>';     
            $('#tabla-particiones tbody').append(htmlTags);
        }
    } else {
        mostrarMensaje("errorCondicionesIniciales", "Primero termine la operación pendiente.");
    }
}
// habilita los controles de porcentaje del SO y otros
// cuando se selecciona un tamaño de memoria
function habilitarControles() {
    document.getElementById("myRange").disabled = false; // habilita el range de porcentaje del SO
    document.getElementById("prtfixed").disabled = false; // habilita el radio de particiones fijas
    document.getElementById("prtvar").disabled = false; // habilita el radio de particiones variables
}

//Funcion que carga en el object los datos para las particiones de distintos tamaños. 
//Cuando presiona el boton Agregar Particiones Manualmente
function guardarPart() {          
    //Carga la particion en el array tabla de particiones que es parte del object
    var tamano = parseInt(document.getElementById(`tamano${idPart}`).value);
    var espacioLibre=condicionesInciales.tablaParticiones.find(element => element.idParticion==0 && element.tamaño>=tamano );
    var index=condicionesInciales.tablaParticiones.indexOf(espacioLibre);
    if (espacioLibre!=undefined) {
        document.getElementById("save"+idPart).style.display = "none";
        document.getElementById("cancel"+idPart).style.display = "none";
        document.getElementById("edit"+idPart).style.display = "block";
        document.getElementById("delete"+idPart).style.display = "block";
        
        cargando1=false;
        var dirfin= espacioLibre.dirInicio+(tamano-1);
        tamanoLibre = tamanoLibre-tamano;
        x=document.getElementById('tabla-particiones').rows[parseInt(idPart,10)].cells;
        x[parseInt(0,10)].innerHTML=idPart;
        x[parseInt(1,10)].innerHTML=espacioLibre.dirInicio;
        x[parseInt(2,10)].innerHTML=dirfin;
        //x[parseInt(3,10)].innerHTML=tamano;
        document.getElementById(`tamano${idPart}`).disabled = true;
        var particion ={ //se crea el object
            "idParticion": idPart,
            "dirInicio": espacioLibre.dirInicio,
            "dirFin": dirfin,
            "tamaño": tamano,
            "estado": 0, //0 libre 1 ocupado
            "idProceso": null,
            "FI": 0,
        };

        espacioLibre.dirInicio=dirfin+1;
        espacioLibre.tamaño=espacioLibre.tamaño-tamano;
       
        condicionesInciales.tablaParticiones.splice((index),0,particion);

        idPart++;
        if (espacioLibre.tamaño == 0) {
            
            condicionesInciales.tablaParticiones.splice((index+1),1);
        }
        if (espacioLibre==0) {
            mostrarMensaje("errorCondicionesIniciales", "No hay mas espacio disponible");
            document.getElementById("boton5").style.visibility="visible";
            document.getElementById("boton4").style.visibility="hidden";
        }
        doGraphichs();
    } else {
        mostrarMensaje("errorCondicionesIniciales", "El tamaño ingresado supera el tamaño disponible: " + tamanoLibre);
    }
    console.log(condicionesInciales);
    $(function () {$('[data-toggle="popover"]').popover()});
}
function cargarParticionesVbles() {
    //Carga los datos: tipo de particion y algortimo
    if($('#prtfixed').is(':checked')) { //F de fija
        condicionesInciales.tipoParticion="F" 
        if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="FF"} //FF Firstfit para fija
        if($('#bstfit').is(':checked')) { condicionesInciales.algoritmo="B"}
    }
    if($('#prtvar').is(':checked')) { //V es de variable
        condicionesInciales.tipoParticion="V"  
        if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="FV"} //FV Firstfit para variable
        if($('#wrtfit').is(':checked')) { condicionesInciales.algoritmo="W"}
    }       
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
                + '</td>'+ '<td id="opciones'+idPart+'">'+
                '<button class="btn btn-outline-dark" id="save'+idPart+'" style="display:block" onclick="guardarPart()">'+'<i class="material-icons align-middle">save</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel'+idPart+'" style="display:block" onclick="anularPart()">'+'<i class="material-icons align-middle">highlight_off</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="edit'+idPart+'" style="display:none" onclick="edit(this)">'+'<i class="material-icons align-middle">create</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="delete'+idPart+'" style="display:none" onclick="delete(this)">'+'<i class="material-icons align-middle">delete_outline</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel2'+idPart+'" style="display:none" onclick="des(this)">'+'<i class="material-icons align-middle">undo</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="acept'+idPart+'" style="display:none" onclick="acept(this)">'+'<i class="material-icons align-middle">done_outline</i>'+'</button>'+
                '<button class="btn btn-outline-dark" id="cancel3'+idPart+'" style="display:none" onclick="cancel()">'+'<i class="material-icons align-middle">close</i>'+'</button>'+
                '</td>'+ '</tr>';       
            $('#tabla-particiones tbody').append(htmlTags);
        }
    } else {
        mostrarMensaje("errorCondicionesIniciales", "El tamaño ingresado supera el tamaño disponible: " + tamanoLibre);
    }
    console.log(condicionesInciales);
}
var tamPart=0;
function edit(nodo) {
    if (cargando1==false && editando1==false) {
        editando1=true;
        fila = (nodo.parentNode).parentNode;
        //Se obtiene el Id del proceso
        idP = fila.getAttribute("id");
        tamPart = parseInt(document.getElementById("tamano"+idP).value);
        //Luego se habilita la edición de los datos
        document.getElementById(`tamano${idP}`).disabled = false;
        //Se ocultan los botones de editar y eliminar
        document.getElementById("edit"+idP).style.display = "none";
        document.getElementById("delete"+idP).style.display = "none";
        
        //Se habilitan los botones Aceptar y Cancelar, correspondientes a la operación de Editar
        document.getElementById("acept"+idP).style.display = "block";
        document.getElementById("cancel3"+idP).style.display = "block";
    } else {
        mostrarMensaje("errorCondicionesIniciales", "Primero termine la operación pendiente.");
    }
}
function acept(nodo) {
    fila = (nodo.parentNode).parentNode;
    //Se obtiene el Id del proceso
    idP = fila.getAttribute("id");
    tamNuevo = parseInt(document.getElementById("tamano"+idP).value);
    if (tamNuevo==tamPart) {//no hay cambios
        document.getElementById(`tamano${idP}`).disabled = true;
        document.getElementById("edit"+idP).style.display = "block";
        document.getElementById("delete"+idP).style.display = "block";        
        //Se habilitan los botones Aceptar y Cancelar, correspondientes a la operación de Editar
        document.getElementById("acept"+idP).style.display = "none";
        document.getElementById("cancel3"+idP).style.display = "none";
        editando1=false;
    }
    if (tamNuevo<tamPart) {//tengo q crear un espacio libre o actualizar el el
        //Actualizo los datos de la particion
        particion=condicionesInciales.tablaParticiones[idP-1];
        particion.tamaño=tamNuevo;
        particion.dirFin=(particion.dirInicio+(tamNuevo-1));
        
        var libreDir=(particion.dirFin+1);
        var libreTamano=(tamPart-tamNuevo);
        tamanoLibre=tamanoLibre+libreTamano;
        if(idP==(condicionesInciales.tablaParticiones.length)){//actualizar el espacio libre
            var particion ={ //se crea el espacio libre
                "idParticion": 0,
                "dirInicio": libreDir,
                "dirFin": (condicionesInciales.tamanoMP-1),
                "tamaño": libreTamano,
                "estado": 0, //0 libre 1 ocupado
                "idProceso": null,
                "FI": 0,
            };
            condicionesInciales.tablaParticiones.push(particion);
            
        }else{
            particion=condicionesInciales.tablaParticiones[idP];
            if (particion.idParticion==0) {
                particion.dirInicio=libreDir;
                particion.tamaño=libreTamano;
            } else {
                var particion ={ //se crea el object
                    "idParticion": 0,
                    "dirInicio": libreDir,
                    "dirFin": (libreDir+libreTamano-1),
                    "tamaño": libreTamano,
                    "estado": 0, //0 libre 1 ocupado
                    "idProceso": null,
                    "FI": 0,
                };
                condicionesInciales.tablaParticiones.splice(idP,0,particion);
            }
        }
        
        document.getElementById("boton4").style.visibility="visible";
    }
    if (tamNuevo>tamPart) {//no esta testeado
        if (tamNuevo<=tamanoLibre) {
            particion=condicionesInciales.tablaParticiones[idP];
            if (particion.idParticion==0) {//el siguiente es espacio libre
                tamanoLibre=tamanoLibre-tamNuevo;
                direccionLibre=direccionLibre+tamNuevo;
                if (tamanoLibre==0) {
                    condicionesInciales.tablaParticiones.pop;//elimino el espacio libre
                }else{
                    //actualizar el espacio libre
                    particion.tamaño=tamanoLibre;
                    particion.dirInicio=direccionLibre;
                    //actualizar la particion editada
                    particion=condicionesInciales.tablaParticiones[idP-1];
                    particion.tamaño=tamNuevo;
                    particion.dirFin=(particion.dirInicio+(tamNuevo-1));
                }            

            } else {//el siguiente es una particion x. La ultima pos del array es el espacio libre
                var particion ={ //se crea el object
                    "idParticion": 0,
                    "dirInicio": libreDir,
                    "dirFin": (libreDir+libreTamano),
                    "tamaño": libreTamano,
                    "estado": 0, //0 libre 1 ocupado
                    "idProceso": null,
                    "FI": 0,
                };
                condicionesInciales.tablaParticiones.splice(idP,0,particion);
            }
        } else {
            mostrarMensaje("errorCondicionesIniciales", "No hay espacio para la particion");
        }
    }
    doGraphichs();
    $(function () {$('[data-toggle="popover"]').popover()});
    document.getElementById(`tamano${idP}`).disabled = true;
    document.getElementById("edit"+idP).style.display = "block";
    document.getElementById("delete"+idP).style.display = "block";        
    //Se habilitan los botones Aceptar y Cancelar, correspondientes a la operación de Editar
    document.getElementById("acept"+idP).style.display = "none";
    document.getElementById("cancel3"+idP).style.display = "none";
    editando1=false;
}
//Funcion que permite cargar el object cuando las particiones son del mismo tamaño.
//Cuando el usuario presiona el boton Agregar Particiones iguales.
function cargarParticionesFijas() {
    var tamanoMP = parseInt(document.getElementById("mp").value);
    var porcentaje = parseInt(document.getElementById("myRange").value) / 100;
    var tamanoSO = Math.ceil(tamanoMP * porcentaje);

    var cantParticiones = parseInt(document.getElementById("cantpart").value);
    var tamanoParticion = parseInt(document.getElementById("tamanopart").value);

    tamanoLibre = tamanoMP - tamanoSO;
    direccionLibre = tamanoSO;

    if ((cantParticiones * tamanoParticion) > tamanoLibre) { // si las particiones agregadas superan el tamaño disponible no deberia agregar
        $("#addprt").modal('hide'); // cierra el modal
        mostrarMensaje("errorCondicionesIniciales", "Las particiones ingresadas superan el espacio disponible: " + tamanoLibre); // muestra el error
        return; // termina la funcion
    }
    document.getElementById("boton1").disabled=true;
    document.getElementById("boton2").disabled=true;
    document.getElementById("boton3").disabled=true;
    document.getElementById("boton4").style.visibility="hidden";
    if($('#prtfixed').is(':checked')) { //F de fija
        condicionesInciales.tipoParticion="F" 
        if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="FF"} //FF Firstfit para fija
        if($('#bstfit').is(':checked')) { condicionesInciales.algoritmo="B"}
    }
    if($('#prtvar').is(':checked')) { //V es de variable
        condicionesInciales.tipoParticion="V"  
        if($('#frtfit').is(':checked')) { condicionesInciales.algoritmo="FV"} //FV Firstfit para variable
        if($('#wrtfit').is(':checked')) { condicionesInciales.algoritmo="W"}
    }
    
    condicionesInciales.tamanoMP=tamanoMP;
    condicionesInciales.porcentajeSO=porcentaje;
    condicionesInciales.tamanoSO=tamanoSO;

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
    mostrarMensaje("avisoCondicionesIniciales", "Se cargaron las particiones");
    console.log(condicionesInciales);
}

// carga una lista con los nombres de todas las listas de particiones guardadas
// y abre el modal para poder seleccionar
// con info de https://www.w3schools.com/jsref/met_select_remove.asp
// y de https://www.w3schools.com/jsref/met_select_add.asp
function modalCargarParticiones() {
    var stringDeConsulta = "SELECT nombre FROM Simulador.dbo.ParticionesFijas;"; // crea el string de la consulta
    var xhttp = new XMLHttpRequest(); // crea el objeto de la peticion ajax
    xhttp.onreadystatechange = function() { // esto se ejecuta cuando la peticion se complete
        if (this.readyState == 4 && this.status == 200) { // se ejecuta si se recibio la respuesta del servidor y no dio error
            var listaDeNombres = JSON.parse(this.responseText).recordset;
            if (listaDeNombres.length == 0) { // si no devuelve ningun nombre no hay nada guardado, no abre el modal
                mostrarMensaje("errorCondicionesIniciales", "No hay ninguna lista de particiones guardada");
            }
            else { // si devuelve algo hay algo guardado
                $("#fromdbprt").modal(); // muestra el modal
                var comboBox = document.getElementById("selectParticiones"); // variable que apunta al select para elegir lista de particiones
                for (var i = comboBox.options.length - 1; i > 0; i--) { // elimina todas las opciones del combobox (menos la que dice "Selecciona")
                    comboBox.remove(i); // si no se hace del ultimo al primero falla
                }
                for (var i = 0; i < listaDeNombres.length; i++) { // va agregando los nombres
                    var option = document.createElement("option");
                    option.text = listaDeNombres[i].nombre;
                    option.value = listaDeNombres[i].nombre;
                    comboBox.add(option);
                }
            }
        }
    };
    xhttp.open("POST", "/ejecutarConsulta?stringDeConsulta=" + stringDeConsulta, true); // hace un post con la peticion ajax
    xhttp.send(); // manda la peticion al servidor
}

// comprueba si se guardaron los cambios para pasar a la carga de trabajo
// con info de https://stackoverflow.com/questions/39461076/how-to-change-active-bootstrap-tab-with-javascript
function continuarParticiones() {
    if (Number(document.getElementById("mp").value) < 128) {
        mostrarMensaje("errorCondicionesIniciales", "El tamaño de la memoria principal no puede ser menor a 128");
        return;
    }
    if (Number(document.getElementById("mp").value) > 2048) {
        mostrarMensaje("errorCondicionesIniciales", "El tamaño de la memoria principal no puede ser mayor a 2048");
        return;
    }
    if (document.getElementById("prtvar").checked == true) { // si las particiones son variables carga los datos en el object
        condicionesInciales.tamanoMP = document.getElementById("mp").value; // carga el tamaño de memoria
        condicionesInciales.porcentajeSO = Number(document.getElementById("myRange").value) / 100; // carga el porcentaje del so
        condicionesInciales.tamanoSO = Math.ceil(condicionesInciales.tamanoMP * condicionesInciales.porcentajeSO); // carga el tamaño del so
        condicionesInciales.tipoParticion = "V"; // carga el tipo de particion (variable)
        if (document.getElementById("frtfit").checked == true) { // si se chequeo el algoritmo first fit lo carga
            condicionesInciales.algoritmo = "FV";
        }
        else if (document.getElementById("wrtfit").checked == true) { // si se chequeo el algoritmo worst fit lo carga
            condicionesInciales.algoritmo = "W";
        }
    }
    if (seGuardaronLasParticiones) { // si se guardo todo continua a la parte de carga de trabajo
        $('a[href="#workload"]').trigger("click"); // cambia a la pestaña carga de trabajo
    }
    else { // si no se guardo todo avisa al usuario
        $("#modalContinuarSinGuardarParticiones").modal(); // muestra el modal que avisa que no se guardo
    }
}

// esta cosa es porque si lo meto en el atributo onclick de un boton no anda un carajo
function continuarParticionesSinGuardar() {
    $('a[href="#workload"]').trigger("click"); // cambia a la pestaña carga de trabajo
}

function doGraphichs() {
    $('#divMemoria1').empty();
    //Grafica el SO
    var texto= "Dir Inicio: 0  "+
        ` Dir Fin: ${(condicionesInciales.tamanoSO-1)}  `+
        ` Tamaño: ${condicionesInciales.tamanoSO}  `;
        htmlTags='<div class="p-2 bg-white">'+
        `<a data-trigger="hover" data-placement="bottom" data-original-title='SO' data-toggle="popover" data-content= '${texto}'>SO</a>` +
        '</div>';
    $('#divMemoria1').append(htmlTags);

    condicionesInciales.tablaParticiones.forEach(element => {
        var texto= "Dir Inicio: "+`${element.dirInicio}  `+
            ` Dir Fin: ${element.dirFin}  `+
            ` Tamaño: ${element.tamaño}  `;
        if (element.idParticion==0) {            
            htmlTags='<div class="p-2 bg-white" id="EL">'+
            `<a data-trigger="hover" data-placement="bottom" data-original-title='Espacio Libre' data-toggle="popover" data-content= '${texto}'>Espacio Libre</a>` +
            '</div>';
            
        }else{
            var idPart=element.idParticion;
            htmlTags='<div class="p-2 bg-white" id="part'+idPart+'">'+
            `<a data-trigger="hover" data-placement="bottom" data-original-title='Particion #${idPart}' data-toggle="popover" data-content= '${texto}'>P${idPart}</a>` +
            '</div>';
        }
        $('#divMemoria1').append(htmlTags);
    });
        

}