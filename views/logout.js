import { limipiarCookies } from "../src/utils.js"

import { Componente } from "../components/componentes.js"

export class Logout extends Componente {
	constructor() {
		super("div", { clase: "logout" })
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h3", { clase: "titulo" })
		this.boton = new Componente("button", { clase: "boton" })

		return this
	}

	configura() {
		this.titulo.setTexto("Seguro que desea salir?")

		this.boton.setTexto("Salir")
		this.boton.setListener("click", () => {
			limipiarCookies()
			window.location.href = "/login"
		})

		return this
	}

	crea() {
		this.addHijos([this.titulo.getComponente(), this.boton.getComponente()])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default Logout
