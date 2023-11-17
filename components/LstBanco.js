import { Componente, ListaDesplegable } from "./componentes.js"

import { SYS, LSTBANCO } from "../src/constantes.js"

export class LstBanco extends Componente {
	constructor() {
		super(SYS.SCTN, { id: LSTBANCO.CONTENEDOR })
		this.opciones = []

		return this.inicia()
	}

	inicia() {
		this.lblBanco = new Componente(SYS.LBL, { id: LSTBANCO.LBL })
		this.selBanco = new ListaDesplegable()
		this.lblBanco.setTexto(LSTBANCO.TXTTITULO)

		return this
	}

	configura() {
		this.selBanco.opciones = this.opciones
		this.addHijos([this.lblBanco.getComponente(), this.selBanco.mostrar()])
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	actualilzaBancos(bancos) {
		this.selBanco.actulizaOpciones(bancos)
		return this
	}

	setTemporalPH(ph) {
		this.selBanco.setPhTmp(ph)
		return this
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

export default LstBanco
