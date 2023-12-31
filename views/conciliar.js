import Vista from "./vista.js"
import { ConciliarCtrl as Controlador } from "../controllers/controladores.js"
import { ConciliarMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Conciliar extends Vista {
	constructor() {
		super("Conciliar")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Conciliar")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista Conciliar se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default Conciliar
