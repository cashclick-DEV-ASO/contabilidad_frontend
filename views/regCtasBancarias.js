import Vista from "./vista.js"
import { RegCtasBancariasCtrl as Controlador } from "../controllers/controladores.js"
import { RegCtasBancariasMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RegCtasBancarias extends Vista {
	constructor() {
		super("RegCtasBancarias")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("RegCtasBancarias")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista RegCtasBancarias se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default RegCtasBancarias
