import { PIE_CLS, MSJ_PIE } from "../src/constantes.js"

import Componente from "./componente.js"

/**
 * @class Pie
 * @extends Componente
 * @description Componente que representa el pie de página
 */
class Pie extends Componente {
    constructor() {
        super("footer", { clase: PIE_CLS })
        return this
    }

    configura() {
        this.setTexto(MSJ_PIE)
        return this
    }

    mostrar() {
        return this.configura().getComponente()
    }
}

export default Pie;