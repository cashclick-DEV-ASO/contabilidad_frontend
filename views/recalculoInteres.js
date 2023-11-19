import Vista from "./vista.js"
import { RecalculoInteresCtrl as Controlador } from "../controllers/controladores.js"
import { RecalculoInteresMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RecalculoInteres extends Vista {
	constructor() {
		super("RecalculoInteres")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("RecalculoInteres")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista RecalculoInteres se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default RecalculoInteres
