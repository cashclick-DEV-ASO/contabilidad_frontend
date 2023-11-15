import { getURL, cerrarSesion, mostrarError } from "../src/utils.js"

export class Modelo {
	constructor(url = getURL()) {
		this.api = url
		this.resultado = null
		this.error = null
	}

	async envia(recurso, datos, metodo) {
		const res = await this.enviaSync(recurso, datos, metodo)
		if (res && res.redirected && !res.url.startsWith(this.api))
			cerrarSesion()
		if (res) await this.procesaResultado(res)

		return this
	}

	enviaSync(recurso, datos, metodo) {
		try {
			return fetch(`${this.api}/${recurso}`, {
				method: metodo,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: metodo === "GET" ? null : JSON.stringify(datos),
			})
		} catch (error) {
			mostrarError(error)
			this.error = error
			this.resultado = null
			return null
		}
	}

	async procesaResultado(resultado) {
		try {
			const r = await this.procesaResultadoSync(resultado)
			if (r.sesionCaducada) return cerrarSesion()
			this.success = r.success
			this.informacion = r.informacion
			this.error = null
		} catch (error) {
			mostrarError(error)
			this.error = error
			this.success = false
			this.informacion = null
		}

		return this
	}

	procesaResultadoSync(resultado) {
		if (resultado.headers.get("content-type").includes("application/json"))
			return resultado.json()
		if (resultado.headers.get("content-type").includes("text/html"))
			return resultado.text()
		return resultado
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
		const query = `SELECT * FROM layout ${
			idBanco ? "WHERE id_banco = ?" : ""
		} ORDER BY alias`
		const parametros = idBanco ? [idBanco] : []
		return this.getInformacionComponentes(query, parametros)
	}

	async getInformacionComponentes(query, parametros = []) {
		return await this.post("noConfig", { query, parametros })
	}
}

export default Modelo
