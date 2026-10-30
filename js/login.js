import { cargarJSON } from "./services/cargar-datos.js";

const formulario = document.getElementById("formularioLogin");
const campoUsuario = document.getElementById("usuario");
const campoContrasena = document.getElementById("password");
const mensajeUsuario = document.getElementById("mensajeUsuario");
const mensajeContrasena = document.getElementById("mensajeContrasena");
const mensajeGeneral = document.getElementById("mensajeGeneral");
const botonLogin = document.getElementById("botonLogin");

const expresionUsuario = /^[a-zA-Z0-9]+$/;
const expresionContrasena = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

let usuarios = [];


cargarJSON("recursos/usuarios.json", function(datos) {
    usuarios = datos;

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

});

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const usuario = campoUsuario.value.trim();
    const contrasena = campoContrasena.value;

    let formularioValido = true;

    if (usuario === "") {
        mensajeUsuario.textContent = "Debes introducir un nombre de usuario.";
        formularioValido = false;
    } else if (!expresionUsuario.test(usuario)) {
        mensajeUsuario.textContent = "El usuario solo puede contener letras y números.";
        formularioValido = false;
    }

    if (contrasena === "") {
        mensajeContrasena.textContent = "Debes introducir una contraseña.";
        formularioValido = false;
    } else if (!expresionContrasena.test(contrasena)) {
        mensajeContrasena.textContent = "La contraseña debe contener letras y números, sin espacios ni caracteres especiales.";
        formularioValido = false;
    }

    if (!formularioValido) {
        return;
    }

    const usuarioEncontrado = usuarios.find(function(u) {
        return u.usuario === usuario && u.contraseña === contrasena;
    });

    if (usuarioEncontrado) {
        const datosUsuario = {
            id: usuarioEncontrado.id,
            nombre: usuarioEncontrado.nombre,
            apellido: usuarioEncontrado.apellido,
            usuario: usuarioEncontrado.usuario
        };

        sessionStorage.setItem("usuarioActual", JSON.stringify(datosUsuario));

        window.location.href = "bienvenida.html";
    } else {
        mensajeGeneral.textContent = "El usuario o la contraseña son incorrectos.";
    }
});