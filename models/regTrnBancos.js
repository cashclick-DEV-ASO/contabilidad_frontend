import Modelo from "./modelo.js"

import { mostrarError } from "../src/utils.js"
import { anchoBBVA } from "../src/layoutParser.js"

export class RegTrnBancosModel extends Modelo {
	constructor() {
		super()
	}

	async leerArchivo(archivo) {
		if (!archivo) {
			this.mensaje = "No se ha seleccionado un archivo."
			return null
		}

		try {
			return await archivo.text()
		} catch (error) {
			mostrarError(error)
			this.mensaje = "Ocurrió un problema al leer el archivo."
			return null
		}
	}

	async aplicaLayout(banco, lyt, contenidoArchivo) {
		this.resultado = null

		if (!contenidoArchivo) {
			this.mensaje = "No se ha proporcionado un archivo."
			return false
		}

		if (!lyt) {
			this.mensaje = "No se ha encontrado el layout."
			return false
		}

		const { tipo, layout } = lyt

		if (banco.texto === "BBVA" && tipo === "fijo") {
			const r = anchoBBVA(contenidoArchivo, JSON.parse(layout))

			this.mensaje = r.mensaje

			this.resultado = {
				success: r.success,
				informacion: r.informacion,
				movimientos: r.movimientos,
			}
			return this.resultado.success
		}

		if (tipo === "delimitado")
			contenidoArchivo = this.layoutDelimitado(contenidoArchivo, layout)

		this.mensaje =
			"No se cuenta con la configuración necesaria para ese layout.\nFavor de notificar al administrador."
		return false
	}

	pruebaAceptar(e, cierre) {
		console.log("Botón Aceptar")
		cierre()
	}

	pruebaCancelar(e, cierre) {
		console.log("Botón Cancelar")
		cierre()
	}

	async guardar(banco, periodo, archivo, layout, contenidoArchivo = this.contenidoArchivo) {
		if (this.valida() !== true) return false

		await this.post("trnBancos", {
			banco,
			periodo,
			archivo,
			layout,
		})

		if (!this.informacion) {
			this.mensaje =
				"Ocurrió un problema al validar la información.\nIntente nuevamente o contacte al administrador."
			mostrarError(this.error)
			return false
		}

		if (this.success) {
			this.mensaje = "El archivo se guardó correctamente."
		} else {
			this.mensaje = "Ocurrió un problema al guardar el archivo."
			mostrarError(this.informacion)
		}

		return this.success
	}

	valida(banco, periodo, archivo, layout, contenidoArchivo = this.contenidoArchivo) {
		if (banco === "") return (this.mensaje = "No se ha seleccionado un banco.")
		else if (periodo === "") return (this.mensaje = "No se ha seleccionado un periodo.")
		else if (archivo === "") return (this.mensaje = "No se ha seleccionado un archivo.")
		else if (layout === "") return (this.mensaje = "No se ha seleccionado un layout.")
		else if (!contenidoArchivo) return (this.mensaje = "No se ha proporcionado un archivo.")
		else return true
	}
}

export default RegTrnBancosModel
