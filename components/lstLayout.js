import { Componente, ListaDesplegable } from "./componentes.js"

import { SYS, LSTLAYOUT } from "../src/constantes.js"

export class LstLayout extends Componente {
	constructor() {
		super(SYS.SCTN, { id: LSTLAYOUT.CONTENEDOR })
		this.opciones = []

		return this.inicia()
	}

	inicia() {
		this.lblLayout = new Componente(SYS.LBL, { id: LSTLAYOUT.LBL })
		this.lblLayout.setTexto(LSTLAYOUT.TXTTITULO)
		this.selLayout = new ListaDesplegable(LSTLAYOUT.PH_VACIO, LSTLAYOUT.PH_LLENO)

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

export default LstLayout
