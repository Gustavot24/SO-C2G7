// muestra un mensaje que da un aviso o un error
// ej: al guardar algo en la db o cuando ingresas algo mal
// se le pasa el id del elemento html y el contenido del mensaje
// con info de https://www.w3schools.com/js/js_htmldom_css.asp
// y de https://www.w3schools.com/js/js_htmldom_animate.asp
// y de https://stackoverflow.com/questions/17883692/how-to-set-time-delay-in-javascript
function mostrarMensaje(id, mensaje) {
    elemento = document.getElementById(id); // variable que apunta al div del mensaje
    elemento.style.display = "block"; // hace que sea visible el mensaje
    elemento.innerHTML = mensaje; // le carga el texto que queres mostrar
    setTimeout(function() {
        var opacidad = 1;
        var id = setInterval(frame, 10);
        function frame() {
            if (opacidad == 0) {
                clearInterval(id);
            } else {
                opacidad -= 0.01;
                elemento.style.opacity = opacidad; 
            }
        }
    }, 3000);
}