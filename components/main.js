import { leerCookie, escribirCookie } from "../src/utils.js"

import { Componente } from "./componentes.js"
import Vistas from "../views/vistas.js"

/**
 * @class Main
 * @extends Componente
 * @description Componente que contiene el contenido principal de la página mostrada
 */
export class Main extends Componente {
	constructor() {
		super("main", { id: "main" })
		this.vistas = Vistas
		this.activa = new (this.vistas[leerCookie("vista")] ?? this.vistas.Inicio)()
		return this
	}

	/**
	 * @param {string} contenido - Contenido a mostrar en el main
	 * @description Configura un contenido para el main
	 */
	setContenido(vista) {
		this.limpiar()
		this.activa = new (this.vistas[vista] || this.vistas.OOPS)()
		this.addHijo(this.activa.mostrar())
		escribirCookie("vista", vista)
	}

	/**
	 * @description Remueve el contenido del main
	 */
	limpiar() {
		this.activa.removeComponente()
	}

	/**
	 * @description Crea el main
	 */
	mostrar() {
		this.addHijo(this.activa.mostrar())
		return this.getComponente()
	}
}

export default Main
