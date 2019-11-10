//import { Script } from "vm";

function fixed (){
    document.getElementById("lalg").style.display = "inline-flex";
    document.getElementById("lfrtfit").style.display = "inline-flex";
    document.getElementById("lwrtfit").style.display = "none";
    document.getElementById("lbstfit").style.display = "inline-flex";
    if(document.getElementById("prtfixed").checked = true){
        document.getElementById("prtvar").disabled = true;
    } else{
        document.getElementById("prtvar").removeAttribute("disable");
    }
}

function variable (){
    document.getElementById("lalg").style.display = "inline-flex";
    document.getElementById("lwrtfit").style.display ="inline-flex";
    document.getElementById("lfrtfit").style.display ="inline-flex";
    document.getElementById("lbstfit").style.display ="none";
    if(document.getElementById("prtvar").checked = true){
        document.getElementById("prtfixed").disabled = true;
    } else{
        document.getElementById("prtfixed").removeAttribute("disable");
    }
}


// muestra un mensaje que da un aviso o un error
// ej: al guardar algo en la db o cuando ingresas algo mal
// se le pasa el id del elemento html y el contenido del mensaje
// con info de https://www.w3schools.com/js/js_htmldom_css.asp
// y de https://www.w3schools.com/js/js_htmldom_animate.asp
// y de https://stackoverflow.com/questions/17883692/how-to-set-time-delay-in-javascript
// y de https://stackoverflow.com/questions/29017379/how-to-make-fadeout-effect-with-pure-javascript
function mostrarMensaje(id, mensaje) {
    elemento = document.getElementById(id); // variable que apunta al div del mensaje
    elemento.style.display = "block"; // hace que sea visible el mensaje
    elemento.style.opacity = 1; // le pone la opacidad al maximo. sin esto al ejecutar varias veces la funcion no muestra anda
    elemento.innerHTML = mensaje; // le carga el texto que queres mostrar
    setTimeout(function() { // esto hace que despues de 3 segundos empiece a hacer el fade
        var fadeEffect = setInterval(function () { // esto hace que vaya desapareciendo cada 30 ms
            if (!elemento.style.opacity) {
                elemento.style.opacity = 1;
            }
            if (elemento.style.opacity > 0) { // si la opacidad es mayor a 0 le baja 0,1
                elemento.style.opacity -= 0.1;
            }
            else { // si la opacidad es 0 para la funcion setInterval y vuelve a ocultar el mensaje
                clearInterval(fadeEffect);
                elemento.style.display = "none";
            }
        }, 30);
    }, 3000);
}