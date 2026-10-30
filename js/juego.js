const tablero = document.getElementById("tablero");
const indicadorTurno = document.getElementById("indicadorTurno");

const filas = 8;
const columnas = 8;
let jugadorActual = "blanca"; // El jugador que comienza es el jugador 1 (blanco)

const tableroArray = [];
const direcciones = [
    [-1, -1], // Arriba izquierda
    [-1, 0],  // Arriba
    [-1, 1],  // Arriba derecha
    [0, -1],  // Izquierda
    [0, 1],   // Derecha
    [1, -1],  // Abajo izquierda
    [1, 0],   // Abajo
    [1, 1]    // Abajo derecha
];

// Crear una matriz de 8 filas y 8 columnas
for (let fila = 0; fila < filas; fila++) {
    tableroArray[fila] = [];

    for (let columna = 0; columna < columnas; columna++) {
        tableroArray[fila][columna] = null;
    }
}

// Colocar las cuatro fichas iniciales
tableroArray[3][3] = "blanca";
tableroArray[3][4] = "negra";
tableroArray[4][3] = "negra";
tableroArray[4][4] = "blanca";

// Crear las casillas del tablero
function crearTablero() {
    tablero.innerHTML = "";

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {

            // Crear la casilla
            const casilla = document.createElement("button");

            casilla.type = "button";
            casilla.classList.add("casilla");
            casilla.setAttribute("role", "gridcell");

            // Guardar la posición de la casilla
            casilla.dataset.fila = fila;
            casilla.dataset.columna = columna;

            // Consultar si hay una ficha en esta posición
            const colorFicha = tableroArray[fila][columna];

            // Si hay una ficha, crearla
            if (colorFicha !== null) {
                const ficha = document.createElement("div");

                ficha.classList.add("ficha", `ficha-${colorFicha}`);

                casilla.appendChild(ficha);
            }

            // Añadir la casilla al tablero
            tablero.appendChild(casilla);
        }
    }
}

// Contar las fichas de cada jugador
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

function comprobarMovimiento(fila, columna) {
    // Implement the logic to check if a move is valid
    if (tableroArray[fila][columna] !== null) {
        return false; // La casilla ya está ocupada
    }

    const fichasVolteadas = obtenerFichasVolteadas(fila, columna);

    return fichasVolteadas.length > 0; // El movimiento es válido si hay fichas que se puedan voltear
}

function obtenerFichasVolteadas(fila, columna) {
    // Implement the logic to get the flipped pieces
    const fichasVolteadas = [];

    for (const direccion of direcciones) {

        const cambioFila = direccion[0];
        const cambioColumna = direccion[1];

        let nuevaFila = fila + cambioFila;
        let nuevaColumna = columna + cambioColumna;

        const fichasRivales = [];

        while (nuevaFila >= 0 && nuevaFila < filas && nuevaColumna >= 0 && nuevaColumna < columnas
            && tableroArray[nuevaFila][nuevaColumna] !== null && tableroArray[nuevaFila][nuevaColumna] !== jugadorActual) {
            
            fichasRivales.push([nuevaFila, nuevaColumna]);
            nuevaFila += cambioFila;
            nuevaColumna += cambioColumna;
        }

        if (fichasRivales.length > 0 && nuevaFila >= 0 && nuevaFila < filas && nuevaColumna >= 0 && nuevaColumna < columnas
            && tableroArray[nuevaFila][nuevaColumna] === jugadorActual) {
            
            fichasVolteadas.push(...fichasRivales);
        }
    }
    return fichasVolteadas;
}

function realizarMovimiento(fila, columna) {
    // Implement the logic to perform a move
    const fichasVolteadas = obtenerFichasVolteadas(fila, columna);
    tableroArray[fila][columna] = jugadorActual;

    for (const posicion of fichasVolteadas) {
        const filaFicha = posicion[0];
        const columnaFicha = posicion[1];
        tableroArray[filaFicha][columnaFicha] = jugadorActual;
    }
    crearTablero();
    actualizarCont();
    cambiarTurno();
}

tablero.addEventListener("click", function(event) {
    const casilla = event.target.closest(".casilla");

    if (!casilla) {
        return; // No se hizo clic en una casilla
    }

    const fila = parseInt(casilla.dataset.fila);
    const columna = parseInt(casilla.dataset.columna);

    if (comprobarMovimiento(fila, columna)) {
        realizarMovimiento(fila, columna);
    } else {
        alert("Movimiento no válido. Por favor, elija otra casilla.");
    }
});

function cambiarTurno() {
    if (jugadorActual === "blanca") {
        jugadorActual = "negra";
        indicadorTurno.textContent = "Turno del jugador 2 (Negra)";
    } else {
        jugadorActual = "blanca";
        indicadorTurno.textContent = "Turno del jugador 1 (Blanca)";
    }
}

// Generar el tablero y actualizar los contadores
crearTablero();
actualizarCont();




// Comprobar que se han creado las 64 casillas
console.log("Casillas creadas:", tablero.children.length);