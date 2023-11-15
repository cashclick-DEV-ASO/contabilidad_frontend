import Controlador from "./controlador.js"

import { RegTrnBancos as Modelo } from "../models/modelos.js"

export class RegTrnBancosController extends Controlador {
	constructor(vista) {
		super(vista, new Modelo())
	}

	limpiaCampos = (lyt = true) => {
		lyt && this.vista.selLayout.limpiar()
		this.vista.selArchivo.limpiar()
		this.vista.tabla.limpiar()
	}

	rellenaBanco = async () => {
		await this.llenaBanco()
	}

	cambioBanco = async () => {
		this.limpiaCampos()
		this.modelo.banco = {
			id: this.vista.selBanco.selBanco.getValorSeleccionado(),
			nombre: this.vista.selBanco.selBanco.getTextoSeleccionado(),
		}
		await this.llenaLayout(this.modelo.banco.id)

		if (this.layouts.length === 0)
			this.msjError("No hay layouts disponibles.").mostrar()

		this.vista.selArchivo.setMensaje("Selecciona un Layout.").mostrar()
	}

	cambioLayout = () => {
		this.limpiaCampos(false)

		this.modelo.layout = this.layouts.find(
			layout =>
				layout.id === Number(this.vista.selLayout.getValorLayout())
		)

		if (this.modelo.layout.extensiones === "")
			return this.msjError(
				"El layout no indican las extensiones validas."
			).mostrar()
		else
			this.vista.selArchivo.setFormato(
				this.modelo.layout.extensiones.split(",")
			)

		this.vista.selArchivo.habilitaSelector()
		this.vista.selArchivo.setMensaje(
			"Oprime el botón para seleccionar un archivo."
		)
	}

	leerArchivo = async () => {
		if (this.vista.selLayout.getValorLayout() === "default") {
			this.msjError("Se debe seleccionar un layout.").mostrar()
			return
		}

		const lecturaOK = await this.modelo.leerArchivo(
			this.vista.selArchivo.ruta
		)

		if (lecturaOK) {
			const layoutOK = await this.modelo.aplicaLayout(
				this.vista.selLayout.getValorLayout()
			)

			if (layoutOK) {
				this.vista.tabla.setDetalles(
					Object.assign(
						{},
						this.modelo.informacion.apertura,
						this.modelo.informacion.cierre
					),
					this.formatoDetalles()
				)

				this.vista.tabla
					//.parseaTexto(this.modelo.contenidoArchivo)
					.parseaJSON(
						this.modelo.movimientos,
						null,
						this.formatoTabla()
					)
					.actualizaTabla()

				this.vista.guardar.setPropiedad("disabled", false)
				return
			}
		}

		this.msjError(this.modelo.mensaje).mostrar()
	}

	guardar = async () => {
		this.modelo.setBanco(this.vista.selBanco.getValor())
		this.modelo.setPeriodo(this.vista.selPeriodo.getValor())
		this.modelo.setArchivo(this.vista.selArchivo.ruta.name)
		this.modelo.setLayout(this.vista.selLayout.getValor())

		this.msjAdvertencia(
			`Se guardará la información del archivo:<br>${this.modelo.archivo}<br>¿Deseas continuar?`
		)
			.addBoton("Aceptar", this.modelo.pruebaAceptar)
			.addBoton("Cancelar", this.modelo.pruebaCancelar)
			.mostrar()
	}

	formatoDetalles = () => {
		return {
			Fecha_Operación: dato => {
				return dato.toLocaleDateString()
			},
			Fecha_Emisión: dato => {
				return dato.toLocaleDateString()
			},
			Saldo_Inicial: dato => {
				return dato.toLocaleString("es-MX", {
					style: "currency",
					currency: "MXN",
				})
			},
			Saldo_Final: dato => {
				return dato.toLocaleString("es-MX", {
					style: "currency",
					currency: "MXN",
				})
			},
			Total_Abonos: dato => {
				return dato.toLocaleString("es-MX", {
					style: "currency",
					currency: "MXN",
				})
			},
			Total_Cargos: dato => {
				return dato.toLocaleString("es-MX", {
					style: "currency",
					currency: "MXN",
				})
			},
		}
	}

	formatoTabla = () => {
		return {
			Fecha_Operación: dato => {
				return dato.toLocaleDateString()
			},
			Fecha_Valor: dato => {
				return dato.toLocaleDateString()
			},
			Monto: dato => {
				return dato.toLocaleString("es-MX", {
					style: "currency",
					currency: "MXN",
				})
			},
			Tipo_Movimiento: dato => {
				const tipos = ["No Identificado", "Cargo", "Abono"]
				return tipos[dato]
			},
		}
	}
}

export default RegTrnBancosController
