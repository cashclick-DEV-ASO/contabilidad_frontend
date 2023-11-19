import Vista from "./vista.js"
import { RecalculoCapitalCtrl as Controlador } from "../controllers/controladores.js"
import { RecalculoCapitalMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RecalculoCapital extends Vista {
	constructor() {
		super("RecalculoCapital")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("RecalculoCapital")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista RecalculoCapital se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default RecalculoCapital
