import Vista from "./vista.js"
import { NoConciliadoCtrl as Controlador } from "../controllers/controladores.js"
import { NoConciliadoMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class NoConciliado extends Vista {
	constructor() {
		super("NoConciliado")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("NoConciliado")

		this.acciones.guardar = new Botonera()
			.addBoton("btnVacio")
			.setIDContenedor("btnVacio")
			.setTexto("Saludar")
			.setListener(this.controlador.saludar)

		this.datos.etiqueta = new Componente(SYS.LBL, { clase: "texto" }).setTexto(
			"La vista NoConciliado se encuentra en desarrollo. Vuelva más tarde."
		)

		return this
	}
}

export default NoConciliado
