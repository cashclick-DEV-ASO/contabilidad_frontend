import Componente from "./componente.js"

class Boton extends Componente {
    constructor(texto, clase = "btnDefault") {
        super(document.createElement("button"), clase)
        this.elemento.textContent = texto
    }
}

export default Boton