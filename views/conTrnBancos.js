import Vista from "./vista.js"
import { ConTrnBancosCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnBancosMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConTrnBancos extends Vista {
	constructor() {
		super("ConTrnBancos")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ConTrnBancos")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista ConTrnBancos se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ConTrnBancos
