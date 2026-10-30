const datosGuardados = sessionStorage.getItem("datosPartida");

const resultadoFinal = document.getElementById("resultadoFinal");
const resultadoBlancas = document.getElementById("resultadoBlancas");
const resultadoNegras = document.getElementById("resultadoNegras");

if (datosGuardados === null) {
    resultadoFinal.textContent = "No hay resultados disponibles.";
} else {
    const datosPartida = JSON.parse(datosGuardados);

    resultadoBlancas.textContent = datosPartida.fichasBlancas;
    resultadoNegras.textContent = datosPartida.fichasNegras;

    if (datosPartida.ganador === "Jugador 1") {
        resultadoFinal.textContent = "¡Ha ganado el jugador 1!";
    } else if (datosPartida.ganador === "Jugador 2") {
        resultadoFinal.textContent = "¡Ha ganado el jugador 2!";
    } else {
        resultadoFinal.textContent = "¡La partida ha terminado en empate!";
    }
}

document.getElementById("botonRepetir").addEventListener("click", function() {
    window.location.href = "bienvenida.html";
});

document.getElementById("botonSalir").addEventListener("click", function() {
    window.location.href = "login.html";
});