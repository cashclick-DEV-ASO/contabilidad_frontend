import Mensaje from "../components/mensaje.js"
import { getURL, cerrarSesion, mostrarError } from "../src/utils.js"

export class Modelo {
	constructor(url = getURL()) {
		this.api = url
		this.response = null
		this.resultado = null
		this.error = null
		this.mensaje = null
		this.mensajesError = {
			401: "Necesita una sesión activa para acceder a este recurso o no tiene los permisos necesarios.",
			404: "No se encontró el recurso solicitado.",
			500: "El servicio no está disponible.<br>Verifique su conexión a internet o intente más tarde.",
		}
	}

	async envia(recurso, datos, metodo) {
		this.resultado = null
		this.error = null
		this.mensaje = null

		await this.enviaSync(recurso, datos, metodo)

		if (this.error) return this
		if (this.response.redirected && !this.response.url.startsWith(this.api)) {
			cerrarSesion()
			return this
		}

		return await this.procesaRespuesta()
	}

	async enviaSync(recurso, datos, metodo) {
		try {
			this.response = await fetch(`${this.api}/${recurso}`, {
				method: metodo,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: metodo === "GET" ? null : JSON.stringify(datos),
			})

			if (!this.response.ok) throw new Error(`HTTP error! status: ${this.response.status}`)
		} catch (error) {
			if (this.response) this.resultado = await this.response.json()

			const mensaje = this.response
				? this.mensajesError[this.response.status]
				: this.mensajesError[500]
			this.preocesaError(error, mensaje, recurso)
		}
	}

	async procesaRespuesta(respuesta = this.response) {
		try {
			const r = this.procesaRespuestaSync(respuesta)

			if (r.tipo === "json") {
				this.resultado = await r.respuesta
				if (this.resultado.sesionCaducada) cerrarSesion()
				return this
			}

			if (r.tipo === "html") {
				this.resultado = r.respuesta
				return this
			}

			return this.preocesaError(r.respuesta)
		} catch (error) {
			return this.preocesaError(error)
		}
	}

	procesaRespuestaSync(respuesta) {
		if (!respuesta.headers)
			return {
				respuesta: respuesta,
				tipo: "desconocido",
			}

		if (respuesta.headers.get("content-type").includes("application/json"))
			return {
				respuesta: respuesta.json(),
				tipo: "json",
			}

		if (respuesta.headers.get("content-type").includes("text/html"))
			return {
				respuesta: respuesta.text(),
				tipo: "html",
			}

		return {
			respuesta,
			tipo: "indefinido",
		}
	}

	preocesaError(error, mensaje = null, recurso = null) {
		if (!this.resultado && recurso !== "login") {
			this.mensaje = mensaje
			this.resultado = {
				success: false,
				informacion: null,
			}

			cerrarSesion()
		}

		if (this.resultado && this.resultado.informacion.sesionCaducada) {
			this.resultado = null
			cerrarSesion()
			return this
		}

		mostrarError(error)
		this.mensaje = mensaje
		this.error = error
		this.resultado = {
			success: false,
			informacion: null,
		}
		return this
	}

	async post(recurso, datos) {
		return await this.envia(recurso, datos, "POST")
	}

	postSync(recurso, datos) {
		return this.enviaSync(recurso, datos, "POST")
	}

	async get(recurso, qry = null) {
		return await this.envia(recurso, qry, "GET")
	}

	getSync(recurso, qry = null) {
		return this.enviaSync(recurso, qry, "GET")
	}

	async patch(recurso, datos) {
		return await this.envia(recurso, datos, "PATCH")
	}

	patchSync(recurso, datos) {
		return this.enviaSync(recurso, datos, "PATCH")
	}

	async delete(recurso, datos) {
		return await this.envia(recurso, datos, "DELETE")
	}

	deleteSync(recurso, datos) {
		return this.enviaSync(recurso, datos, "DELETE")
	}

	async getBancos(idBanco = null) {
		const query = `SELECT id, nombre FROM banco${
			idBanco ? " WHERE id_banco = ? " : " "
		}ORDER BY nombre`
		const parametros = idBanco ? [idBanco] : []
		return this.getInformacionComponentes(query, parametros)
	}

	async getLayouts(idBanco = null) {
		const query = `SELECT * FROM layout ${idBanco ? "WHERE id_banco = ?" : ""} ORDER BY alias`
		const parametros = idBanco ? [idBanco] : []
		return this.getInformacionComponentes(query, parametros)
	}

	async getInformacionComponentes(query, parametros = []) {
		return await this.post("noConfig", { query, parametros })
	}
}

export default Modelo
