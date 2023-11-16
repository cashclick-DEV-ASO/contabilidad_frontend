import LoginController from "../controllers/login.js"

import Componente from "../components/componente.js"

/**
 * @class Login
 * @extends Componente
 * @description Vista para mostrar el fomulario de login
 */
export class Login extends Componente {
	#controlador

	constructor() {
		super("form", { clase: "formulario" })
		this.#controlador = new LoginController(this)
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("label", { clase: "lblTitulo" })
		this.titulo.setTexto("Inicio de sesión")

		this.usuario = new Componente("input", { clase: "inputLogin" })
		this.usuario.setPropiedad("placeholder", "Usuario")

		this.password = new Componente("input", { clase: "inputLogin" })
		this.password.setPropiedad("type", "password")
		this.password.setPropiedad("placeholder", "Contraseña")

		this.btnLogin = new Componente("button", { clase: "btnLogin" })
		this.btnLogin.setTexto("Iniciar sesión")
		this.setListener("submit", this.#controlador.login)

		this.addHijos([
			this.titulo.mostrar(),
			this.usuario.mostrar(),
			this.password.mostrar(),
			this.btnLogin.mostrar(),
		])
		return this
	}

	mostrar() {
		return this.getComponente()
	}
}

export default Login
