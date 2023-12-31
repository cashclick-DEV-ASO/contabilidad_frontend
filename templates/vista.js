import Vista from "./vista.js"
import { NombreControlador as Controlador } from "../controllers/controladores.js"
import { NombreModelo as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class NombreVista extends Vista {
	constructor() {
		super("NombreVista")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("NombreVista")

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

export default NombreVista
