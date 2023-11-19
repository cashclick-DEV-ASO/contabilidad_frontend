import Vista from "./vista.js"
import { RegCtasContablesCtrl as Controlador } from "../controllers/controladores.js"
import { RegCtasContablesMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RegCtasContables extends Vista {
	constructor() {
		super("RegCtasContables")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("RegCtasContables")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista RegCtasContables se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default RegCtasContables
