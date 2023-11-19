import Vista from "./vista.js"
import { EdoCtaCtrl as Controlador } from "../controllers/controladores.js"
import { EdoCtaMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class EdoCta extends Vista {
	constructor() {
		super("EdoCta")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("EdoCta")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista EdoCta se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default EdoCta
