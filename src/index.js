import Index from "../views/index.js"

const contenido = () => {
    const contenedor = document.querySelector(".contenedor")
    contenedor.appendChild(new Index().mostrar())
}

contenido()