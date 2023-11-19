import { Componente } from "./componentes.js"

import { SYS, MUESTRA_DATO } from "../src/constantes.js"

export class MuestraDato extends Componente {
	constructor() {
		super(SYS.SCTN, { clase: MUESTRA_DATO.CONTENEDOR })

		this.txtEtiqueta = MUESTRA_DATO.TXT_ETIQUETA
		this.txtDato = ""
		this.boton = null
		this.editable = false

		return this.inicia()
	}

	inicia() {
		this.setEstilo2()

		this.lbl = new Componente(SYS.LBL, { clase: MUESTRA_DATO.LBL })

		this.dato = new Componente(SYS.IN, { clase: MUESTRA_DATO.DTO })

		return this
	}

	configura() {
		this.vaciar()

		this.lbl.setTexto(this.txtEtiqueta)

		this.dato.setValor(this.txtDato)

		this.dato.habilitar(this.editable)

		this.addHijos([
			this.lbl.mostrar(),
			this.dato.mostrar(),
			this.boton ? this.btn.mostrar() : null,
		])

		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	setTxtEtiqueta(txt) {
		this.txtEtiqueta = txt
		return this
	}

	setTxtDato(txt) {
		this.txtDato = txt
		return this
	}

	setEditable(editable) {
		this.editable = editable
		return this
	}

	setBoton(boton) {
		this.boton = boton
		return this
	}

	getDato() {
		return this.dato.getTexto()
	}

	cambiaColorFuente(color) {
		this.dato.setPropiedad("color", color)
		return this
	}

	cambiaColorFondo(color) {
		this.dato.setPropiedad("background-color", color)
		return this
	}
}

export default MuestraDato
