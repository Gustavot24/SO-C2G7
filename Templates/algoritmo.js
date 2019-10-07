var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}

var idPart=1;
var direccionLibre=0;
var tamanoLibre =0;
function mostrar() {
    if (idPart==1) {
        var tamanoMP = document.getElementById("mp").value;
        var porcentaje =parseInt(document.getElementById("myRange").value)/100;
        var tamanoSO = Math.ceil(tamanoMP* porcentaje);
        tamanoLibre= tamanoMP-tamanoSO;
        direccionLibre = tamanoSO;
    } 
    var tamano = parseInt(document.getElementById(`tamano${idPart}`).value);
    if (tamano <= tamanoLibre) {
        var dirfin= direccionLibre+tamano-1;
        tamanoLibre = tamanoLibre-tamano;
        x=document.getElementById('tabla-particiones').rows[parseInt(idPart,10)].cells;
        x[parseInt(0,10)].innerHTML=idPart;
        x[parseInt(1,10)].innerHTML=direccionLibre;
        x[parseInt(2,10)].innerHTML=dirfin;
        x[parseInt(3,10)].innerHTML=tamano;
        idPart++;
        direccionLibre = (dirfin+1);
        if (tamanoLibre == 0) {
            alert("No hay mas espacio disponible");
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
        alert("El tamaño ingresado supera el tamaño disponible: " + tamanoLibre);
    }
    
}


