import Componente from "./componente.js"

export class Div extends Componente {
    constructor(clase = "divDefault") {
        super(document.createElement("div"), clase)
    }

    appendChild(elemento) {
        this.elemento.appendChild(elemento)
    }
}

export default Div