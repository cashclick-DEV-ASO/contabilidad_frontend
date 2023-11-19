import Vista from "./vista.js"
import { VariablesCtrl as Controlador } from "../controllers/controladores.js"
import { VariablesMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Variables extends Vista {
	constructor() {
		super("Variables")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Variables")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista Variables se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default Variables
