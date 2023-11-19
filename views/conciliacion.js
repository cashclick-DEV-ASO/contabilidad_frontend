import Vista from "./vista.js"
import { ConciliacionCtrl as Controlador } from "../controllers/controladores.js"
import { ConciliacionMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Conciliacion extends Vista {
	constructor() {
		super("Conciliación")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Conciliación")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista Conciliación se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default Conciliacion
