import Vista from "./vista.js"
import { ConCtasContablesCtrl as Controlador } from "../controllers/controladores.js"
import { ConCtasContablesMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConCtasContables extends Vista {
	constructor() {
		super("ConCtasContables")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ConCtasContables")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista ConCtasContables se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ConCtasContables
