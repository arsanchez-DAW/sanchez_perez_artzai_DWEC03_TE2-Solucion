const botonEmpezar = document.getElementById("botonEmpezar");
const botonesDificultad = document.querySelectorAll(".boton-dificultad");

let dificultadSeleccionada = "intermedio";

botonesDificultad.forEach(function(boton) {
    boton.addEventListener("click", function() {
        botonesDificultad.forEach(function(otroBoton) {
            otroBoton.classList.remove("seleccionado");
        });

        boton.classList.add("seleccionado");

        if (boton.classList.contains("principiante")) {
            dificultadSeleccionada = "principiante";
        } else if (boton.classList.contains("intermedio")) {
            dificultadSeleccionada = "intermedio";
        } else if (boton.classList.contains("avanzado")) {
            dificultadSeleccionada = "avanzado";
        }
    });
});

botonEmpezar.addEventListener("click", function() {
    sessionStorage.setItem("dificultad", dificultadSeleccionada);
    if (dificultadSeleccionada === "principiante") {
        sessionStorage.setItem("filas", 6);
        sessionStorage.setItem("columnas", 6);
    } else if (dificultadSeleccionada === "intermedio") {
        sessionStorage.setItem("filas", 8);
        sessionStorage.setItem("columnas", 8);
    } else if (dificultadSeleccionada === "avanzado") {
        sessionStorage.setItem("filas", 10);
        sessionStorage.setItem("columnas", 10);
    }
    window.location.href = "juego.html";

});