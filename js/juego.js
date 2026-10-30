const tablero = document.getElementById("tablero");
const indicadorTurno = document.getElementById("indicadorTurno");
const contadorTiempo = document.getElementById("contadorTiempo");
const mensajeAviso = document.getElementById("mensajeAviso");

const filas = Number(sessionStorage.getItem("filas")) || 8;
const columnas = Number(sessionStorage.getItem("columnas")) || 8;

tablero.style.setProperty("--filas", filas);
tablero.style.setProperty("--columnas", columnas);

let tiempoRestante = 30;
let temporizador;

let jugadorActual = "blanca";
let partidaTerminada = false;

const tableroArray = [];
const direcciones = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

for (let fila = 0; fila < filas; fila++) {
    tableroArray[fila] = [];

    for (let columna = 0; columna < columnas; columna++) {
        tableroArray[fila][columna] = null;
    }
}

const centroFila = filas / 2 - 1;
const centroColumna = columnas / 2 - 1;

tableroArray[centroFila][centroColumna] = "blanca";
tableroArray[centroFila][centroColumna + 1] = "negra";
tableroArray[centroFila + 1][centroColumna] = "negra";
tableroArray[centroFila + 1][centroColumna + 1] = "blanca";

function crearTablero() {
    tablero.innerHTML = "";

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            const casilla = document.createElement("button");

            casilla.type = "button";
            casilla.classList.add("casilla");
            casilla.setAttribute("role", "gridcell");
            casilla.dataset.fila = fila;
            casilla.dataset.columna = columna;

            const colorFicha = tableroArray[fila][columna];

            if (colorFicha !== null) {
                const ficha = document.createElement("div");
                ficha.classList.add("ficha", `ficha-${colorFicha}`);
                casilla.appendChild(ficha);
            }

            tablero.appendChild(casilla);
        }
    }
}

function actualizarCont() {
    let contadorBlancas = 0;
    let contadorNegras = 0;

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            const colorFicha = tableroArray[fila][columna];

            if (colorFicha === "blanca") {
                contadorBlancas++;
            } else if (colorFicha === "negra") {
                contadorNegras++;
            }
        }
    }

    document.getElementById("fichasJugador1").textContent = contadorBlancas;
    document.getElementById("fichasJugador2").textContent = contadorNegras;
}

function comprobarMovimiento(fila, columna, jugador = jugadorActual) {
    if (tableroArray[fila][columna] !== null) {
        return false;
    }

    const fichasVolteadas = obtenerFichasVolteadas(fila, columna, jugador);

    return fichasVolteadas.length > 0;
}

function obtenerFichasVolteadas(fila, columna, jugador = jugadorActual) {
    const fichasVolteadas = [];

    for (const direccion of direcciones) {
        const cambioFila = direccion[0];
        const cambioColumna = direccion[1];

        let nuevaFila = fila + cambioFila;
        let nuevaColumna = columna + cambioColumna;

        const fichasRivales = [];

        while (
            nuevaFila >= 0 &&
            nuevaFila < filas &&
            nuevaColumna >= 0 &&
            nuevaColumna < columnas &&
            tableroArray[nuevaFila][nuevaColumna] !== null &&
            tableroArray[nuevaFila][nuevaColumna] !== jugador
        ) {
            fichasRivales.push([nuevaFila, nuevaColumna]);
            nuevaFila += cambioFila;
            nuevaColumna += cambioColumna;
        }

        if (
            fichasRivales.length > 0 &&
            nuevaFila >= 0 &&
            nuevaFila < filas &&
            nuevaColumna >= 0 &&
            nuevaColumna < columnas &&
            tableroArray[nuevaFila][nuevaColumna] === jugador
        ) {
            fichasVolteadas.push(...fichasRivales);
        }
    }

    return fichasVolteadas;
}

function hayMovimientosValidos(jugador) {
    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            if (comprobarMovimiento(fila, columna, jugador)) {
                return true;
            }
        }
    }

    return false;
}

function realizarMovimiento(fila, columna) {
    const fichasVolteadas = obtenerFichasVolteadas(fila, columna, jugadorActual);

    tableroArray[fila][columna] = jugadorActual;

    for (const posicion of fichasVolteadas) {
        const filaFicha = posicion[0];
        const columnaFicha = posicion[1];

        tableroArray[filaFicha][columnaFicha] = jugadorActual;
    }

    crearTablero();
    actualizarCont();

    mensajeAviso.textContent = "";

    cambiarTurno();
}

tablero.addEventListener("click", function(event) {
    if (partidaTerminada) {
        return;
    }

    const casilla = event.target.closest(".casilla");

    if (!casilla) {
        return;
    }

    const fila = Number(casilla.dataset.fila);
    const columna = Number(casilla.dataset.columna);

    if (comprobarMovimiento(fila, columna)) {
        realizarMovimiento(fila, columna);
    } else {
        mensajeAviso.textContent = "Movimiento no válido. Elige otra casilla.";
    }
});

tablero.addEventListener("mouseover", function(event) {
    const casilla = event.target.closest(".casilla");

    if (casilla) {
        casilla.classList.add("resaltada");
    }
});

tablero.addEventListener("mouseout", function(event) {
    const casilla = event.target.closest(".casilla");

    if (casilla) {
        casilla.classList.remove("resaltada");
    }
});

function cambiarTurno() {
    clearInterval(temporizador);

    if (jugadorActual === "blanca") {
        jugadorActual = "negra";
    } else {
        jugadorActual = "blanca";
    }

    if (hayMovimientosValidos(jugadorActual)) {
        actualizarIndicadorTurno();
        iniciarTemporizador();
        return;
    }

    const jugadorAnterior = jugadorActual === "blanca" ? "negra" : "blanca";

    if (hayMovimientosValidos(jugadorAnterior)) {
        jugadorActual = jugadorAnterior;
        actualizarIndicadorTurno();
        mensajeAviso.textContent = "El rival no tiene movimientos disponibles. Pierde su turno.";
        iniciarTemporizador();
        return;
    }

    finalizarPartida();
}

function actualizarIndicadorTurno() {
    if (jugadorActual === "blanca") {
        indicadorTurno.textContent = "Turno del jugador 1 (blancas)";
    } else {
        indicadorTurno.textContent = "Turno del jugador 2 (negras)";
    }
}

function finalizarPartida() {
    clearInterval(temporizador);
    partidaTerminada = true;

    const contadorBlancas = Number(
        document.getElementById("fichasJugador1").textContent
    );

    const contadorNegras = Number(
        document.getElementById("fichasJugador2").textContent
    );

    let resultado = "";
    indicadorTurno.textContent = "Partida terminada";
    contadorTiempo.textContent = "0";
    mensajeAviso.textContent = "La partida ha terminado.";

    if (contadorBlancas > contadorNegras) {
        resultado = "Jugador 1";
    } else if (contadorNegras > contadorBlancas) {
        resultado = "Jugador 2";
    } else {
        resultado = "Nadie";
    }

    const datosPartida = {
        fichasBlancas: contadorBlancas,
        fichasNegras: contadorNegras,
        ganador: resultado
    };

    sessionStorage.setItem("datosPartida", JSON.stringify(datosPartida));

    window.location.href = "resultados.html";
}

function iniciarTemporizador() {
    clearInterval(temporizador);
    tiempoRestante = 30;
    contadorTiempo.textContent = tiempoRestante;

    temporizador = setInterval(function() {
        tiempoRestante--;
        contadorTiempo.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            cambiarTurnoPorTiempo();
        }
    }, 1000);
}

function cambiarTurnoPorTiempo() {
    mensajeAviso.textContent = "Se ha agotado el tiempo. Pierdes el turno.";

    if (jugadorActual === "blanca") {
        jugadorActual = "negra";
    } else {
        jugadorActual = "blanca";
    }

    if (hayMovimientosValidos(jugadorActual)) {
        actualizarIndicadorTurno();
        iniciarTemporizador();
    } else {
        const jugadorAnterior = jugadorActual === "blanca" ? "negra" : "blanca";

        if (hayMovimientosValidos(jugadorAnterior)) {
            jugadorActual = jugadorAnterior;
            actualizarIndicadorTurno();
            mensajeAviso.textContent = "El rival tampoco tiene movimientos disponibles. Recuperas el turno.";
            iniciarTemporizador();
        } else {
            finalizarPartida();
        }
    }
}

crearTablero();
actualizarCont();
actualizarIndicadorTurno();
iniciarTemporizador();