import { borrarCookie } from "./utils.js"
import Login from "../views/login.js"

const contenido = () => {
    borrarCookie("token")
    borrarCookie("user")

    const contenedor = document.querySelector(".login")
    contenedor.appendChild(new Login().mostrar())
}

contenido()