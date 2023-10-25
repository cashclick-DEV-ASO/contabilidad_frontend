import { borrarCookie } from "./utils.js"
import FormularioLogin from "../views/login.js"

const contenido = () => {
    borrarCookie("token")
    borrarCookie("user")
    const contenedor = document.querySelector(".login")
    const formulario = new FormularioLogin()
    formulario.crearElementos()
    contenedor.appendChild(formulario.elemento)
}

contenido()