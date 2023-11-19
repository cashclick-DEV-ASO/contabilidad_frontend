import Vista from "./vista.js"
import { ConCtasBancariasCtrl as Controlador } from "../controllers/controladores.js"
import { ConCtasBancariasMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConCtasBancarias extends Vista {
	constructor() {
		super("ConCtasBancarias")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("ConCtasBancarias")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista ConCtasBancarias se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default ConCtasBancarias
