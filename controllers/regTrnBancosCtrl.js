import Controlador from "./controlador.js"

export class RegTrnBancosController extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	cargaInicial = () => {
		this.acciones.selBanco.setTemporalPH("Cargando bancos...")
		this.llenaListaBancos().then(() => {
			this.acciones.selBanco.actulizaOpciones(this.bancos)
		})
	}

	cambioBanco = async () => {
		this.limpiaCampos()
		this.acciones.selLayout.actulizaOpciones().setTemporalPH("Cargando layout...").mostrar()

		this.banco = this.bancos.find(
			banco => banco.valor === Number(this.acciones.selBanco.getValorSeleccionado())
		)

		if (this.banco === undefined) {
			this.msjError("No se encontró información del banco seleccionado.")
			this.acciones.selArchivo.setMensaje("Selecciona un Banco.")
			this.acciones.selLayout.actulizaOpciones([])
			return
		}

		this.llenaListaLayouts(this.banco.valor).then(() => {
			if (this.layouts.length === 0) {
				this.msjError("No hay layouts disponibles.")
				this.acciones.selArchivo.setMensaje("Selecciona un Banco.")
				return
			}

			this.acciones.selLayout.actulizaOpciones(this.layouts)
			this.acciones.selArchivo.setMensaje("Selecciona un Layout.")
		})
	}

	cambioLayout = () => {
		this.limpiaCampos({ lyt: false })

		this.layout = this.layouts.find(
			layout => layout.valor === Number(this.acciones.selLayout.getValorSeleccionado())
		)

		if (this.layout === undefined) {
			this.msjError("No se encontró información del layout seleccionado.")
			this.acciones.selArchivo.setMensaje("Selecciona un Layout.")
			return
		}

		if (this.layout.extension === "")
			return this.msjError("El layout no indican las extensiones soportadas.")
		else this.acciones.selArchivo.setFormato(this.layout.extension.split(","))

		this.acciones.selArchivo.habilitaSelector()
		this.acciones.selArchivo.setMensaje("Oprime el botón para seleccionar un archivo.")
	}

	limpiaCampos = ({ lyt = true, bnk = false } = {}) => {
		bnk && this.acciones.selBanco.reinicia()
		lyt && this.acciones.selLayout.reinicia()
		this.acciones.selArchivo.limpiar()
		this.datos.tabla.limpiar()
	}

	cambioArchivo = () => {
		this.acciones.guardar.habilitarBoton(false)
	}

	leerArchivo = async () => {
		if (this.acciones.selLayout.getValorSeleccionado() === "default") {
			this.msjError("Se debe seleccionar un layout.")
			return
		}

		const lecturaOK = await this.modelo.leerArchivo(this.acciones.selArchivo.ruta)

		if (lecturaOK) {
			await this.modelo.aplicaLayout(this.banco, this.layout, lecturaOK)

			if (this.modelo.resultado) {
				const { informacion, movimientos } = this.modelo.resultado

				this.datos.tabla.setDetalles(
					Object.assign({}, informacion.apertura, informacion.cierre),
					this.formatoDetalles()
				)

				this.datos.tabla.parseaJSON(movimientos, null, this.formatoTabla()).actualizaTabla()

				this.acciones.guardar.habilitarBoton(true)
				return
			}
		}

		this.msjError(this.modelo.mensaje)
	}

	guardar = async () => {
		this.msjContinuar(
			`Se guardará la información del archivo:<br><br>${this.acciones.selArchivo.ruta.name}<br><br>¿Desea continuar?`,
			{
				txtSi: "Si, guardar",
				txtNo: "No, cancelar",
				callbackSi: this.modelo.pruebaAceptar,
			}
		)
	}

	opcionesFecha() {
		return {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}
	}

	formatoDetalles = () => {
		return {
			Fecha_Operación: dato => {
				return dato.toLocaleDateString("es-ES", this.opcionesFecha)
			},
			Fecha_Emisión: dato => {
				return dato.toLocaleDateString("es-ES", this.opcionesFecha)
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
