import { Componente } from "./componentes.js"

import { SYS, LST } from "../src/constantes.js"

export class ListaDesplegable extends Componente {
	constructor(phVacio = LST.SIN_OPT, phLleno = LST.SEL, mostrarPh = true) {
		super(SYS.LST, { clase: LST.CONTENEDOR })
		this.default = SYS.DFLT
		this.txtPhVacio = phVacio
		this.txtPhLleno = phLleno
		this.mostrarPh = mostrarPh
		this.opciones = []

		return this.inicia()
	}

	inicia() {
		this.placeholder = new Componente(SYS.OPT)
		this.placeholder.setValor(this.default)
		this.placeholder.setPropiedad(SYS.DSBL, true)

		return this
	}

	configura() {
		this.vaciar()

		this.configuraPlaceholder()

		this.opciones.forEach(opcion => {
			this.addHijo(this.setOpcion(opcion).mostrar())
		})

		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	actulizaOpciones(opciones) {
		this.opciones = opciones
		this.vaciar()
		this.configuraPlaceholder()
		opciones.forEach(opcion => {
			this.addHijo(this.setOpcion(opcion).mostrar())
		})
	}

	addOpcion(opcion) {
		this.addHijo(this.setOpcion(opcion).mostrar())
		return this
	}

	setPhTmp(ph) {
		// this.removePrimerHijo()
		this.placeholder.setTexto(ph).mostrar()
		// this.setPrimerHijo(this.placeholder.mostrar())
	}

	configuraPlaceholder() {
		if (this.mostrarPh) {
			this.placeholder.setTexto(this.opciones.length ? this.txtPhLleno : this.txtPhVacio)
			this.placeholder.setPropiedad("selected", true)
			this.addHijo(this.placeholder.getComponente())
		}
	}

	setPhVacio(placeholder) {
		this.txtPhVacio = placeholder
		return this
	}

	setPhLleno(placeholder) {
		this.txtPhLleno = placeholder
		return this
	}

	setOpcion(atributos) {
		const opcion = new Componente(SYS.OPT)
		opcion.setTexto(atributos.texto)
		opcion.setValor(atributos.valor ?? atributos.texto)
		return opcion
	}

	setOpciones(opciones) {
		return opciones.map(opcion => {
			this.setOpcion(opcion)
		})
	}

	reinicia() {
		this.getComponente().value = this.default
		return this
	}

	limpiar() {
		this.opciones = []
		this.vaciar()
		this.configuraPlaceholder()
		return this
	}

	getValorSeleccionado() {
		return this.getComponente().value
	}

	getNumeroOpciones() {
		return this.getComponente().length
	}

	getTextoSeleccionado() {
		return this.getComponente().selectedOptions[0].textContent
	}

	getIndiceSeleccionado() {
		return this.getComponente().selectedIndex
	}

	setSeleccionByIndice(valor) {
		this.getComponente().selectedIndex = valor
		return this
	}

	setSeleccionByValor(valor) {
		this.getComponente().value = valor
		return this
	}

	setMostrarPh(mostrar) {
		this.mostrarPh = mostrar
		return this
	}
}
