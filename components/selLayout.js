import { TITULO_LAYOUT_CLS, SEL_LAYOUT_CLS } from "../src/constantes.js"

import { Componente, ListaDesplegable } from "./componentes.js"

export class SelLayout extends Componente {
	constructor() {
		super("section", { clase: SEL_LAYOUT_CLS })
		this.opciones = []

		return this.inicia()
	}

	inicia() {
		this.lblLayout = new Componente("label", { clase: TITULO_LAYOUT_CLS })
		this.selLayout = new ListaDesplegable("Sin layout")

		return this
	}

	configura() {
		this.lblLayout.setTexto("Layout")

		this.selLayout.setOpciones(this.opciones)

		return this
	}

	crea() {
		this.addHijos([
			this.lblLayout.getComponente(),
			this.selLayout.mostrar(),
		])

		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}

	setOpcion(opcion) {
		this.opciones.push(opcion)

		return this
	}

	setOpciones(opciones) {
		this.opciones = this.opciones.concat(opciones)

		return this
	}

	limpiar() {
		this.opciones = []
		this.selLayout.limpiar()

		return this
	}

	getValorLayout() {
		return this.selLayout.getValor()
	}

	getTextoLayout() {
		return this.selLayout.getTexto()
	}
}

export default SelLayout
