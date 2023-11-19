import Vista from "./vista.js"
import { RegTrnMambuCtrl as Controlador } from "../controllers/controladores.js"
import { RegTrnMambuMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RegTrnMambu extends Vista {
	constructor() {
		super("RegTrnMambu")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("RegTrnMambu")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista RegTrnMambu se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default RegTrnMambu
