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
		this.lblLayout.setTexto("Layout")

		return this
	}

	configura() {
		this.selLayout.opciones = this.opciones
		this.addHijos([this.lblLayout.getComponente(), this.selLayout.mostrar()])

		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	actualilzaLayouts(layouts) {
		this.selLayout.actulizaOpciones(layouts)
		return this
	}

	setTemporalPH(ph) {
		this.selLayout.setPhTmp(ph)
		return this
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
		// this.opciones = []
		this.selLayout.limpiar()

		return this
	}

	reinicia() {
		this.selLayout.reinicia()

		return this
	}

	getValor() {
		return this.selLayout.getValor()
	}

	getTexto() {
		return this.selLayout.getTexto()
	}

	getValorSeleccionado() {
		return this.selLayout.getValorSeleccionado()
	}

	getTextoSeleccionado() {
		return this.selLayout.getTextoSeleccionado()
	}

	getNumeroOpciones() {
		return this.selLayout.getNumeroOpciones()
	}
}

export default SelLayout
