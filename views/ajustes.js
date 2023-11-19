import Vista from "./vista.js"
import { AjustesCtrl as Controlador } from "../controllers/controladores.js"
import { AjustesMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Ajustes extends Vista {
	constructor() {
		super("Ajustes")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Ajustes")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista Ajustes se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default Ajustes
