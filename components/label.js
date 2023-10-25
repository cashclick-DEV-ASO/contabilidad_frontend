import Componente from "./componente.js"

class Label extends Componente {
    constructor(texto, clase = "lblDefault") {
        super(document.createElement("label"), clase)
        this.elemento.textContent = texto
    }
}

export default Label