import Modelo from "./modelo.js"

import { limipiarCookies, escribirCookie, mostrarError } from "../src/utils.js"

export class LoginModel extends Modelo {
	constructor() {
		super()
		this.user = ""
		this.pass = ""
		limipiarCookies()
	}

	setUsuario(usuario) {
		this.user = usuario
	}

	setPassword(password) {
		this.pass = password
	}

	async login() {
		if (!this.valida()) return false

		await this.post("login", {
			user: this.user,
			pass: this.pass,
		})

		if (this.resultado.success) {
			const { nombre, mapa } = this.resultado.datos[0]
			escribirCookie("SESION", true)
			escribirCookie("NOMBRE", nombre)
			escribirCookie("RUTAS", mapa)
		} else if (this.error) {
			this.mensaje =
				this.mensaje ??
				"Ocurrió un problema al validar la información.\nIntente nuevamente o contacte al administrador."
			return false
		}

		this.mensaje = "Credenciales incorrectas."

		return this.resultado.success
	}

	valida() {
		this.mensaje = null

		if (this.user === "" && this.pass === "")
			this.mensaje = "No se han proporcionado credenciales de acceso."
		else if (this.user === "") this.mensaje = "No se ha proporcionado el nombre de usuario."
		else if (this.pass === "") this.mensaje = "No se ha proporcionado la contraseña."

		return this.mensaje === null
	}
}

export default LoginModel
