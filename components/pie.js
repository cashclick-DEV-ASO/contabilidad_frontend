import { PIE_CLS, MSJ_PIE } from "../src/constantes.js"

import { Componente } from "./componentes.js"

/**
 * @class Pie
 * @extends Componente
 * @description Componente que representa el pie de página
 */
export class Pie extends Componente {
	constructor() {
		super("footer", { id: PIE_CLS })
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

export default Pie
