import { getURL, cerrarSesion, mostrarError } from "../src/utils.js"

export class Modelo {
	constructor(url = getURL()) {
		this.api = url
		this.response = null
		this.resultado = null
		this.error = null
	}

	async envia(recurso, datos, metodo) {
		this.resultado = null
		this.error = null
		this.response = await this.enviaSync(recurso, datos, metodo)

		if (this.error) return this
		if (this.response.redirected && !this.response.url.startsWith(this.api)) {
			cerrarSesion()
			return this
		}

		return await this.procesaRespuesta()
	}

	async enviaSync(recurso, datos, metodo) {
		try {
			const response = await fetch(`${this.api}/${recurso}`, {
				method: metodo,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: metodo === "GET" ? null : JSON.stringify(datos),
			})
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
			return response
		} catch (error) {
			return this.preocesaError(error)
		}
	}

	async procesaRespuesta(respuesta = this.response) {
		try {
			const r = this.procesaRespuestaSync(respuesta)

			if (r.tipo === "json") {
				r.resultado = await r.respuesta
				if (r.sesionCaducada) {
					cerrarSesion()
					return this
				}
				this.success = r.success
				this.informacion = r.informacion
				this.error = null
				return this
			}

			if (r.tipo === "html") {
				this.success = false
				this.informacion = r.resultado
				this.error = null
				return this
			}

			return this.preocesaError(r.resultado)
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

	preocesaError(error) {
		mostrarError(error)
		this.error = error
		this.resultado = {
			success: false,
			informacion: null,
		}
		return null
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
