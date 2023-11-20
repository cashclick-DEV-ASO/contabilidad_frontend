import { Componente } from "./componentes.js"

import { SYS, SOLICITA_DATO } from "../src/constantes.js"

export class SolicitaDato extends Componente {
	constructor() {
		super(SYS.SCTN, { clase: SOLICITA_DATO.CONTENEDOR })

		this.txtEtiqueta = SOLICITA_DATO.TXT_ETIQUETA
		this.txtPlaceholder = SOLICITA_DATO.TXT_PLACEHOLDER
		this.fechaInicio = null
		this.boton = null
		this.tipo = SYS.TXT

		return this.inicia()
	}

	inicia() {
		this.setEstilo1()

		this.lbl = new Componente(SYS.LBL, { clase: SOLICITA_DATO.LBL })

		this.dato = new Componente(SYS.IN, { clase: SOLICITA_DATO.IN })

		return this
	}

	configura() {
		this.vaciar()

		this.lbl.setTexto(this.txtEtiqueta)

		this.dato.setPropiedad("type", this.tipo).setPropiedad(SYS.PH, this.txtPlaceholder)

		this.addHijos([
			this.lbl.mostrar(),
			this.dato.mostrar(),
			this.boton ? this.btn.mostrar() : null,
		])

		if (this.fechaInicio) this.dato.getComponente().valueAsDate = this.fechaInicio

		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	reinicia() {
		if (this.fechaInicio) this.dato.getComponente().valueAsDate = this.fechaInicio
		else this.dato.getComponente().value = ""
		return this
	}

	setTxtEtiqueta(txt) {
		this.txtEtiqueta = txt
		return this
	}

	setTxtPlaceholder(txt) {
		this.txtPlaceholder = txt
		return this
	}

	setTipo(tipo) {
		this.tipo = tipo
		return this
	}

	setBoton(boton) {
		this.boton = boton
		return this
	}

	setValor(valor) {
		this.dato.setValor(valor)
		return this
	}

	setValorFecha(valor) {
		this.fechaInicio = valor
		return this
	}

	getValor() {
		return this.dato.getValor()
	}

	setListenerCambio(callback, evento = SYS.CHNG) {
		this.dato.setListener(evento, callback)
		return this
	}

	setPropiedad(propiedad, valor) {
		this.dato.setPropiedad(propiedad, valor)
		return this
	}

	setClaseDato(clase) {
		this.dato.setClase(clase)
		return this
	}

	setIDDato(id) {
		this.dato.setID(id)
		return this
	}

	setClaseLbl(clase) {
		this.dato.setClase(clase)
		return this
	}

	setIDLbl(id) {
		this.dato.setID(id)
		return this
	}

	habilitarInput(disabled) {
		this.dato.habilitar(disabled)
		return this
	}
}

export default SolicitaDato
