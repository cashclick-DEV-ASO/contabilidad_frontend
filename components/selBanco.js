import { TITULO_BANCO_CLS, SEL_BANCO_CLS, BBVA, CONEKTA, STP } from "../src/constantes.js"

import { Componente, ListaDesplegable } from "./componentes.js"

export class SelBanco extends Componente {
	constructor() {
		super("section", { clase: SEL_BANCO_CLS })
		this.opciones = []

		return this.inicia()
	}

	inicia() {
		this.lblBanco = new Componente("label", { clase: TITULO_BANCO_CLS })
		this.selBanco = new ListaDesplegable()
		this.opcBBVA = new Componente("option")
		this.opcConekta = new Componente("option")
		this.opcSTP = new Componente("option")
		return this
	}

	configura() {
		this.lblBanco.setTexto("Banco")

		this.selBanco.setOpciones(this.opciones)

		return this
	}

	crea() {
		this.addHijos([this.lblBanco.getComponente(), this.selBanco.mostrar()])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}

	getValor() {
		return this.selBanco.getValor()
	}

	getTexto() {
		return this.selBanco.getTexto()
	}

	getValorSeleccionado() {
		return this.selBanco.getValorSeleccionado()
	}

	getTextoSeleccionado() {
		return this.selBanco.getTextoSeleccionado()
	}

	reinicia() {
		this.selBanco.reinicia()
		return this
	}
}
