import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnMambuCtrl extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	cambiaFechaI = () => {
		if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
			this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
	}

	cambiaFechaF = () => {
		if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
			this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
	}

	limpiaCampos = () => {
		this.datos.tabla.limpiar()
	}

	buscar = () => {
		this.msjInformacion("Buscando...")
	}
}

export default ConTrnMambuCtrl
