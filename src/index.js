import Index from "../views/index.js"

const contenido = () => {
    const contenedor = document.querySelector(".contenedor")
    const index = new Index()
    index.crearElementos()
    contenedor.appendChild(index.elemento)
}

contenido()