import { cerrarSesion } from "../src/utils.js"

import { Componente } from "../components/componentes.js"

export class Logout extends Componente {
	constructor() {
		super("div", { clase: "logout" })
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h3", { clase: "tituloLgt" })
		this.boton = new Componente("button", { clase: "boton" })

		return this
	}

	configura() {
		this.titulo.setTexto("Seguro que desea salir?")

		this.boton.setTexto("Salir")
		this.boton.setListener("click", cerrarSesion)

		return this
	}

	crea() {
		this.addHijos([this.titulo.mostrar(), this.boton.mostrar()])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default Logout
