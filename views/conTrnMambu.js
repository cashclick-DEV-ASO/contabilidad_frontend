import Vista from "./vista.js"
import { ConTrnMambuCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnMambuMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConTrnMambu extends Vista {
	constructor() {
		super("ConTrnMambu")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ConTrnMambu")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista ConTrnMambu se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ConTrnMambu
