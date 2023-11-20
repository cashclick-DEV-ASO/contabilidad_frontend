import Modelo from "./modelo.js"

import { mostrarError } from "../src/utils.js"
import { anchoBBVA } from "../src/layoutParser.js"

export class RegTrnBancosMdl extends Modelo {
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

	async guardar(edoCta) {
		const datID = {
			query: "INSERT INTO edo_cta (periodo, archivo, fecha_captura, id_cuenta) VALUES (?, ?, ?, ?)",
			parametros: [edoCta.periodo, edoCta.archivo, edoCta.fecha_carga, edoCta.id_cuenta],
		}

		const id_edo_cta = await this.post("noConfig", datID)

		if (id_edo_cta.error) {
			this.mensaje = "Error al guardar el estado de cuenta."
			return false
		}
		const id_edo = id_edo_cta.resultado.informacion.resultado.insertId
		const trnsToSend = edoCta.trns.map(trn => {
			return [
				id_edo,
				trn.linea,
				trn.informacion,
				this.txtToFechaMysql(trn.fecha_creacion),
				this.txtToFechaMysql(trn.fecha_valor),
				trn.concepto,
				trn.tipo,
				this.monedaToFloat(trn.monto),
				edoCta.id_layout,
			]
		})

		const datos = {
			query: "INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto, id_layout) VALUES ?",
			parametros: [trnsToSend],
		}

		await this.post("noConfig", datos)
	}

	valida(banco, periodo, archivo, layout, contenidoArchivo = this.contenidoArchivo) {
		if (banco === "") return (this.mensaje = "No se ha seleccionado un banco.")
		else if (periodo === "") return (this.mensaje = "No se ha seleccionado un periodo.")
		else if (archivo === "") return (this.mensaje = "No se ha seleccionado un archivo.")
		else if (layout === "") return (this.mensaje = "No se ha seleccionado un layout.")
		else if (!contenidoArchivo) return (this.mensaje = "No se ha proporcionado un archivo.")
		else return true
	}

	txtToFechaMysql(fecha) {
		const [dia, mes, anio] = fecha.split("/")
		return `${anio}-${mes}-${dia}`
	}

	monedaToFloat(monto) {
		return parseFloat(monto.replace(/[$,]/gi, ""))
	}
}

export default RegTrnBancosMdl
