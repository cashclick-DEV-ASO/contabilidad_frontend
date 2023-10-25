import Componente from "./componente.js"

/**
 * @class Input
 * @extends Componente
 * @param {string} tipo - Tipo de input
 * @description Crea un input
 */
class Input extends Componente {
    constructor(tipo, clase = "txtDefault") {
        super(document.createElement("input"), clase)
        this.elemento.type = tipo
    }

    /**
     * @param {string} placeholder - Placeholder para el input
     * @description Agrega un placeholder al input
     */
    addPlaceholder(placeholder) {
        this.elemento.placeholder = placeholder
    }

    /**
     * @param {string} value - Valor para el input
     * @description Agrega un valor al input
     */
    addValor(valor) {
        this.elemento.value = valor
    }

    /**
     * @description Devuelve el valor del input
     */
    getValor() {
        return this.elemento.value
    }


}

export default Input