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
		this.usuario = new Componente("input", { clase: "inputLogin" })
		this.password = new Componente("input", { clase: "inputLogin" })
		this.btnLogin = new Componente("button", { clase: "btnLogin" })
		return this
	}

	configura() {
		this.titulo.setTexto("Inicio de sesión")

		this.usuario.setPropiedad("placeholder", "Usuario")

		this.password.setPropiedad("type", "password")
		this.password.setPropiedad("placeholder", "Contraseña")

		this.btnLogin.setTexto("Iniciar sesión")
		this.setListener("submit", this.#controlador.login)

		return this
	}

	crea() {
		this.addHijos([
			this.titulo.getComponente(),
			this.usuario.getComponente(),
			this.password.getComponente(),
			this.btnLogin.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default Login
