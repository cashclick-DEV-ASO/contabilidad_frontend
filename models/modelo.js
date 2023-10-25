class Modelo {
    constructor(apiHOST) {
        this.apiHOST = apiHOST
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
        return fetch(`${this.apiHOST}/${recurso}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
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
        return fetch(`${this.apiHOST}/${recurso}`)
    }

    async procesaResultado(resultado) {
        try {
            this.resultado = await this.procesaResultadoSync(resultado)
            this.error = null
        } catch (error) {
            this.error = error
            this.resultado = null
        }
    }

    procesaResultadoSync(resultado) {
        return resultado.json()
    }
}

export default Modelo