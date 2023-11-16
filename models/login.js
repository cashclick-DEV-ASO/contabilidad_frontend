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
		if (this.valida() != true) return false

		await this.post("login", {
			user: this.user,
			pass: this.pass,
		})

		if (this.error) {
			this.mensaje =
				this.mensaje ??
				"Ocurrió un problema al validar la información.\nIntente nuevamente o contacte al administrador."
			return false
		}

		if (this.resultado.success) {
			const { token, nombre, mapa } = this.resultado.informacion
			escribirCookie("TOKEN", token, {
				"max-age": 30 * 60 * 1000,
				secure: true,
			})
			escribirCookie("NOMBRE", nombre)
			escribirCookie("RUTAS", mapa)
		} else {
			this.mensaje = "Credenciales incorrectas."
		}

		return this.resultado.success
	}

	valida() {
		if (this.user === "" && this.pass === "")
			return (this.mensaje = "No se han proporcionado credenciales de acceso.")
		else if (this.user === "")
			return (this.mensaje = "No se ha proporcionado el nombre de usuario.")
		else if (this.pass === "") return (this.mensaje = "No se ha proporcionado la contraseña.")
		else return true
	}
}

export default LoginModel
