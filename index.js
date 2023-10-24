import { leerCookie } from "./src/utils.js"
import { inicio } from "./views/inicio"

const contenido = () => {
    const contenedor = document.querySelector(".contenedor")
    const status = leerCookie("status")
    inicio(contenedor, status.menu)
}

contenido()