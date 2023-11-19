import Vista from "./vista.js"
import { ConSaldosCtrl as Controlador } from "../controllers/controladores.js"
import { ConSaldosMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConSaldos extends Vista {
	constructor() {
		super("ConSaldos")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ConSaldos")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista ConSaldos se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ConSaldos
