import Modelo from "./modelo.js"

import { mostrarError } from "../src/utils.js"
import { anchoBBVA } from "../src/layoutParser.js"

export class RegTrnBancosModel extends Modelo {
	constructor() {
		super()
		this.banco = ""
		this.periodo = ""
		this.archivo = {}
		this.layout = null
		this.mensaje = ""
		this.contenidoArchivo = null
	}

	setBanco(banco) {
		this.banco = banco
	}

	setPeriodo(periodo) {
		this.periodo = periodo
	}

	setArchivo(archivo) {
		this.archivo = archivo
	}

	setLayout(layout) {
		this.layout = layout
	}

	async leerArchivo(archivo) {
		this.contenidoArchivo = null
		if (!archivo) {
			this.mensaje = "No se ha seleccionado un archivo."
			return false
		}

		try {
			this.contenidoArchivo = await archivo.text()
			return true
		} catch (error) {
			mostrarError(error)
			this.mensaje = "Ocurrió un problema al leer el archivo."
			return false
		}
	}

	async aplicaLayout() {
		if (!this.contenidoArchivo) {
			this.mensaje = "No se ha proporcionado un archivo."
			return false
		}

		if (!this.layout) {
			this.mensaje = "No se ha encontrado el layout."
			return false
		}

		const { tipo, layout } = this.layout

		if (this.banco.nombre === "BBVA" && tipo === "fijo") {
			const r = anchoBBVA(this.contenidoArchivo, JSON.parse(layout))

			this.mensaje = r.mensaje
			this.movimientos = r.movimientos
			this.informacion = r.informacion
			return r.success
		}

		if (tipo === "delimitado")
			this.contenidoArchivo = this.layoutDelimitado(this.contenidoArchivo, layout)

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

	async guardar() {
		if (this.valida() !== true) return false

		await this.post("trnBancos", {
			banco: this.banco,
			periodo: this.periodo,
			archivo: this.archivo,
			layout: this.layout,
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

	valida() {
		if (this.banco === "") return (this.mensaje = "No se ha seleccionado un banco.")
		else if (this.periodo === "") return (this.mensaje = "No se ha seleccionado un periodo.")
		else if (this.archivo === "") return (this.mensaje = "No se ha seleccionado un archivo.")
		else if (this.layout === "") return (this.mensaje = "No se ha seleccionado un layout.")
		else return true
	}
}

export default RegTrnBancosModel
