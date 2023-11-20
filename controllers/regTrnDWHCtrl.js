import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegTrnDWHCtrl extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	cargaInicial = () => {}

	leerArchivo = async () => {
		const lectura = await this.acciones.archivo.getArchivo().text()
		// this.datos.tabla.csvToTabla(lectura)
		this.datos.tabla.parseaTexto(lectura, ",").actualizaTabla()
		this.acciones.guardar.habilitarBoton(true)
	}
}

export default RegTrnDWHCtrl
