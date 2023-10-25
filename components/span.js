import Componente from "./componente.js"

export class Span extends Componente {
    constructor(texto, clase = "spanDefault") {
        super(document.createElement("span"), clase)
        this.elemento.textContent = texto
    }

    setContenido(contenido) {
        this.elemento.innerHTML = contenido
    }

    setTexto(texto) {
        this.elemento.textContent = texto
    }
}

export default Span