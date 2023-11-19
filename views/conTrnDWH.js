import Vista from "./vista.js"
import { ConTrnDWHCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnDWHMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConTrnDWH extends Vista {
	constructor() {
		super("NombreVista")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ConTrnDWH")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista NombreVista se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ConTrnDWH
