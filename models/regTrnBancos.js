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

	async aplicaLayout(idLayout) {
		if (!this.contenidoArchivo) {
			this.mensaje = "No se ha proporcionado un archivo."
			return false
		}

		if (!this.layout) {
			this.mensaje = "No se ha encontrado el layout."
			return false
		}

		if (this.banco.nombre === "BBVA" && this.layout.tipo === "ancho") {
			const r = anchoBBVA(
				this.contenidoArchivo,
				JSON.parse(this.layout.layout)
			)
			this.mensaje = r.mensaje
			this.movimientos = r.movimientos
			this.informacion = r.informacion
			return r.success
		}

		if (this.layout.tipo === "delimitado")
			this.contenidoArchivo = this.layoutDelimitado(
				this.contenidoArchivo,
				this.layout.campos,
				this.layout.separador
			)

		this.mensaje =
			"No se cuenta con la configuración necesaria para ese layout.\nFavor de notificar al administrador."
		return false
	}

	async pruebaAceptar(e, cierre) {
		console.log("Botón Aceptar")
		cierre()
	}

	async pruebaCancelar(e, cierre) {
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
		if (this.banco === "")
			return (this.mensaje = "No se ha seleccionado un banco.")
		else if (this.periodo === "")
			return (this.mensaje = "No se ha seleccionado un periodo.")
		else if (this.archivo === "")
			return (this.mensaje = "No se ha seleccionado un archivo.")
		else if (this.layout === "")
			return (this.mensaje = "No se ha seleccionado un layout.")
		else return true
	}
}

const layoutBBVA = [
	{
		id: 1,
		alias: "cobranza BBVA",
		extensiones: ["txt", "exp"],
		layout: {
			tipo: "ancho",
			apertura: {
				idRegistro: 1,
				campos: {
					No_Cta: {
						inicio: 3,
						espacios: 16,
						tipo: "number",
					},
					Titular: {
						inicio: 51,
						espacios: 23,
						tipo: "string",
					},
					Fecha_Operación: {
						inicio: 20,
						espacios: 6,
						tipo: "date",
					},
					Fecha_Emisión: {
						inicio: 26,
						espacios: 6,
						tipo: "date",
					},
					Saldo_Inicial: {
						inicio: 33,
						espacios: 14,
						tipo: "decimal",
					},
				},
			},
			registros: {
				idRegistro: 2,
				tandem: {
					movimiento: 2,
					detalle: 3,
					inicio: 1,
					espacios: 1,
				},
				campos: {
					Fecha_Operación: {
						inicio: 10,
						espacios: 6,
						tipo: "date",
					},
					Fecha_Valor: {
						inicio: 16,
						espacios: 6,
						tipo: "date",
					},
					Id_Operación: {
						inicio: 24,
						espacios: 3,
						tipo: "string",
					},
					Tipo_Movimiento: {
						inicio: 27,
						espacios: 1,
						tipo: "number",
					},
					Monto: {
						inicio: 28,
						espacios: 14,
						tipo: "decimal",
					},
					Descripción_1: {
						inicio: 52,
						espacios: 28,
						tipo: "string",
					},
					Descripción_2: {
						inicio: 85,
						espacios: 30,
						tipo: "string",
					},
					Descripción_3: {
						inicio: 122,
						espacios: 38,
						tipo: "string",
					},
				},
			},
			cierre: {
				idRegistro: 3,
				tandem: {
					idMovimiento: 2,
					detalle: 3,
					inicio: 1,
					espacios: 1,
				},
				campos: {
					Saldo_Final: {
						inicio: 137,
						espacios: 14,
						tipo: "decimal",
					},
					Total_Cargos: {
						inicio: 103,
						espacios: 14,
						tipo: "decimal",
					},
					Total_Abonos: {
						inicio: 122,
						espacios: 14,
						tipo: "decimal",
					},
					No_Cargos: {
						inicio: 98,
						espacios: 5,
						tipo: "number",
					},
					No_Abonos: {
						inicio: 117,
						espacios: 5,
						tipo: "number",
					},
				},
			},
		},
	},
	{
		id: 2,
		alias: "cobranza BBVA Alterno",
		extensiones: ["csv", "xlsx"],
		layout: {
			tipo: "ancho",
			apertura: {
				idRegistro: 1,
				campos: {
					No_Cta: {
						inicio: 3,
						espacios: 16,
						tipo: "number",
					},
					Titular: {
						inicio: 51,
						espacios: 23,
						tipo: "string",
					},
					Fecha_Operación: {
						inicio: 20,
						espacios: 6,
						tipo: "date",
					},
					Fecha_Emisión: {
						inicio: 26,
						espacios: 6,
						tipo: "date",
					},
					Saldo_Inicial: {
						inicio: 33,
						espacios: 14,
						tipo: "decimal",
					},
				},
			},
			registros: {
				idRegistro: 2,
				tandem: {
					movimiento: 2,
					detalle: 3,
					inicio: 1,
					espacios: 1,
				},
				campos: {
					Fecha_Operación: {
						inicio: 10,
						espacios: 6,
						tipo: "date",
					},
					Fecha_Valor: {
						inicio: 16,
						espacios: 6,
						tipo: "date",
					},
					Id_Operación: {
						inicio: 24,
						espacios: 3,
						tipo: "string",
					},
					Tipo_Movimiento: {
						inicio: 27,
						espacios: 1,
						tipo: "number",
					},
					Monto: {
						inicio: 28,
						espacios: 14,
						tipo: "decimal",
					},
					Descripción_1: {
						inicio: 52,
						espacios: 28,
						tipo: "string",
					},
					Descripción_2: {
						inicio: 85,
						espacios: 30,
						tipo: "string",
					},
					Descripción_3: {
						inicio: 122,
						espacios: 38,
						tipo: "string",
					},
				},
			},
			cierre: {
				idRegistro: 3,
				tandem: {
					idMovimiento: 2,
					detalle: 3,
					inicio: 1,
					espacios: 1,
				},
				campos: {
					Saldo_Final: {
						inicio: 137,
						espacios: 14,
						tipo: "decimal",
					},
					Total_Cargos: {
						inicio: 103,
						espacios: 14,
						tipo: "decimal",
					},
					Total_Abonos: {
						inicio: 122,
						espacios: 14,
						tipo: "decimal",
					},
					No_Cargos: {
						inicio: 98,
						espacios: 5,
						tipo: "number",
					},
					No_Abonos: {
						inicio: 117,
						espacios: 5,
						tipo: "number",
					},
				},
			},
		},
	},
]

const layoutConekta = {
	id: 2,
	alias: "cobranza Conekta",
	layout: {
		tipo: "delimitado",
		campos: { fecha: 1, idMov: 0, monto: 3, concepto: 2 },
		separador: "|",
	},
}

const layoutMambu = {
	id: 3,
	alias: "cobranza Mambu",
	layout: {
		tipo: "delimitado",
		campos: { fecha: 0, idMov: 1, monto: 2, concepto: 3 },
		separador: "|",
	},
}

export default RegTrnBancosModel
