import { leerCookie } from "../src/utils.js"

import Componente from "../components/componente.js"

const logo = new URL("../images/Cashclick_logo.svg", import.meta.url).href

export class Inicio extends Componente {
	constructor() {
		super("section", { clase: "inicio" })
		return this.inicia()
	}

	inicia() {
		this.nombre = new Componente("span", { clase: "msjBienvenida" })
		this.imagen = new Componente("img", { clase: "logo" })
		this.mensaje = new Componente("span", { clase: "msjBienvenida" })
		return this
	}

	configura() {
		this.nombre.setTexto(`Bienvenido ${leerCookie("NOMBRE")}`)

		this.imagen.setPropiedad("src", logo)
		this.imagen.setPropiedad("alt", "Logo Cashclick")

		this.mensaje.setTexto("al sistema de gestion contable integral.")
		return this
	}

	crea() {
		this.addHijos([
			this.nombre.getComponente(),
			this.mensaje.getComponente(),
			this.imagen.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default Inicio
