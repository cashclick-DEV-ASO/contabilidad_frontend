export class Modelo {
	constructor(url) {
		this.api = url
		this.resultado = null
		this.error = null
	}

	async post(recurso, datos) {
		try {
			const res = await this.postSync(recurso, datos)
			await this.procesaResultado(res)
		} catch (error) {
			this.error = error
			this.resultado = null
		}
	}

	postSync(recurso, datos) {
		return fetch(`${this.api}/${recurso}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(datos),
		})
	}

	async get(recurso) {
		try {
			const res = await this.getSync(recurso)
			await this.procesaResultado(res)
		} catch (error) {
			this.error = error
			this.resultado = null
		}
	}

	getSync(recurso) {
		return fetch(`${this.api}/${recurso}`)
	}

	async procesaResultado(resultado) {
		try {
			const r = await this.procesaResultadoSync(resultado)
			this.success = r.success
			this.informacion = r.informacion
			this.error = null
		} catch (error) {
			this.error = error
			this.success = false
			this.informacion = null
		}
	}

	procesaResultadoSync(resultado) {
		return resultado.json()
	}
}

export default Modelo
