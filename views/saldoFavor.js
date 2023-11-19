import Vista from "./vista.js"
import { SaldoFavorCtrl as Controlador } from "../controllers/controladores.js"
import { SaldoFavorMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class SaldoFavor extends Vista {
	constructor() {
		super("SaldoFavor")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("SaldoFavor")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista SaldoFavor se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default SaldoFavor
