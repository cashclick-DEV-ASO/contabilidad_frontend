import {
	TITULO_BANCO_CLS,
	SEL_BANCO_CLS,
	BBVA,
	CONEKTA,
	STP,
} from "../src/constantes.js"

import { Componente, ListaDesplegable } from "./componentes.js"

export class SelBanco extends Componente {
	constructor() {
		super("section", { clase: SEL_BANCO_CLS })
		this.opcionesDefault = []
		// 	{ valor: 1, texto: BBVA },
		// 	{ valor: 2, texto: CONEKTA },
		// 	{ valor: 3, texto: STP },
		// ]

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

		this.selBanco.setOpciones(
			this.opciones ? this.opciones : this.opcionesDefault
		)

		return this
	}

	crea() {
		this.addHijos([this.lblBanco.getComponente(), this.selBanco.mostrar()])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}

	getValorBanco() {
		return this.selBanco.getValor()
	}

	getTextoBanco() {
		return this.selBanco.getTexto()
	}
}
