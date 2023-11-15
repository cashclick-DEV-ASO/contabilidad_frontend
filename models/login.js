import Modelo from "./modelo.js"

import { limipiarCookies, escribirCookie, mostrarError } from "../src/utils.js"

export class LoginModel extends Modelo {
	constructor() {
		super()
		this.user = ""
		this.pass = ""
		this.mensaje = "No se han proporcionado credenciales de acceso."
		limipiarCookies()
	}

	setUsuario(usuario) {
		this.user = usuario
	}

	setPassword(password) {
		this.pass = password
	}

	async login() {
		if (this.valida() != true) return false

		await this.post("login", {
			user: this.user,
			pass: this.pass,
		})

		if (!this.informacion) {
			this.mensaje =
				"Ocurrió un problema al validar la información.\nIntente nuevamente o contacte al administrador."
			mostrarError(this.error)
			return false
		}

		if (this.success) {
			escribirCookie("TOKEN", this.informacion.token, {
				"max-age": 30 * 60 * 1000,
				secure: true,
			})
			escribirCookie("NOMBRE", this.informacion.nombre)
			escribirCookie("RUTAS", this.informacion.mapa)
		} else {
			this.mensaje = "Credenciales incorrectas."
			mostrarError(this.informacion)
		}

		return this.success
	}

	valida() {
		if (this.user === "" && this.pass === "")
			return (this.mensaje =
				"No se han proporcionado credenciales de acceso.")
		else if (this.user === "")
			return (this.mensaje =
				"No se ha proporcionado el nombre de usuario.")
		else if (this.pass === "")
			return (this.mensaje = "No se ha proporcionado la contraseña.")
		else return true
	}
}

export default LoginModel
