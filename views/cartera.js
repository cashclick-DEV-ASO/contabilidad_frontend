import Vista from "./vista.js"
import { CarteraCtrl as Controlador } from "../controllers/controladores.js"
import { CarteraMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Cartera extends Vista {
	constructor() {
		super("Cartera")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Cartera")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista Cartera se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default Cartera
