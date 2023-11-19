import Vista from "./vista.js"
import { RegSaldosCtrl as Controlador } from "../controllers/controladores.js"
import { RegSaldosMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RegSaldos extends Vista {
	constructor() {
		super("RegSaldos")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("RegSaldos")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista RegSaldos se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default RegSaldos
