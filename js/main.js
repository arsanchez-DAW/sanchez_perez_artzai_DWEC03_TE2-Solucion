import { cargarJSON } from 'cargar-datos.js';

const JSON_PATH = '../recursos/usuarios.json';


const campoUsuario = document.getElementById("usuario");
const campoContrasena = document.getElementById("password");

let usuarios = [];

cargarJSON(JSON_PATH, (datos) => {
    usuarios = datos;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
});

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    
    const usuarioLog = campoUsuario.value.trim();
    const contrasenaLog = campoContrasena.value.trim();

    const usuarioEncontrado = usuarios.find(usuario => usuario.usuario === usuarioLog && usuario.contraseña === contrasenaLog);
});

if (usuarioEncontrado) {
    sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
    window.location.href = "index.html";
} else {
    alert("Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.");
}