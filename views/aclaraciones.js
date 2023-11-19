import Vista from "./vista.js"
import { AclaracionesCtrl as Controlador } from "../controllers/controladores.js"
import { AclaracionesMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Aclaraciones extends Vista {
	constructor() {
		super("Aclaraciones")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Aclaraciones")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista Aclaraciones se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default Aclaraciones
