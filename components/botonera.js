import { Componente, Mensaje } from "./componentes.js"

import { SYS, BOTONERA } from "../src/constantes.js"

export class Botonera extends Componente {
	constructor() {
		super(SYS.SCTN, { clase: BOTONERA.CONTENEDOR })

		this.botones = {}

		return this.inicia()
	}

	inicia() {
		this.setEstilo1()

		return this
	}

	configura() {
		this.vaciar()

		Object.keys(this.botones).forEach(key => {
			this.addHijo(this.botones[key].mostrar())
		})

		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	setIDContenedor(id) {
		this.setID(id)
		return this
	}

	setBotonUnico(id) {
		this.botones = {}
		this.botones[id] = new Componente(SYS.BTN, { clase: BOTONERA.BTN })
		return this
	}

	addBoton(id) {
		this.botones[id] = new Componente(SYS.BTN, { clase: BOTONERA.BTN })
		return this
	}

	addBotones(ids, limpiar = false) {
		if (limpiar) this.botones = {}
		ids.forEach(id => {
			this.addBoton(id)
		})
		return this
	}

	setTexto(id, txt = null) {
		this.botones[id].setTexto(txt || id)
		return this
	}

	setListener(id, callback = this.btnNoConfigurado, evento = SYS.CLK) {
		this.botones[id].setListener(evento, callback)
		return this
	}

	setId(idBtn, id) {
		this.botones[idBtn].setID(id)
		return this
	}

	setDisabled(idBtn, habilitar = true) {
		this.botones[idBtn].habilitar(habilitar)
		return this
	}

	getBoton(id) {
		return this.botones[id]
	}

	getBotones() {
		return this.botones
	}

	getNumeroBotones() {
		return Object.keys(this.botones).length
	}

	getPrimero() {
		return this.botones[Object.keys(this.botones)[0]]
	}

	getUltimo() {
		return this.botones[Object.keys(this.botones).pop()]
	}

	getByIndex(index) {
		return this.botones[Object.keys(this.botones)[index]]
	}

	btnNoConfigurado = () => {
		new Mensaje().setMensaje("Botón no configurado.").setTipo(Mensaje.tipo.ERROR).mostrar()
	}

	limpiar() {
		this.botones = {}
		return this
	}
}

export default Botonera
