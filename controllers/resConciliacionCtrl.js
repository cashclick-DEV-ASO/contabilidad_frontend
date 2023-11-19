import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ResConciliacionCtrl extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	cargaInicial = () => {}

	saludar = () => {
		this.msjInformacion("Hola mundo")
	}
}

export default ResConciliacionCtrl
