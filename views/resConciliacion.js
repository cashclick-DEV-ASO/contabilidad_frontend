import Vista from "./vista.js"
import { ResConciliacionCtrl as Controlador } from "../controllers/controladores.js"
import { ResConciliacionMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ResConciliacion extends Vista {
	constructor() {
		super("ResConciliacion")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ResConciliacion")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista ResConciliacion se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ResConciliacion
