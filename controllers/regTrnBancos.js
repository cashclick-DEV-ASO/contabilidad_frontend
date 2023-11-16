import Controlador from "./controlador.js"

export class RegTrnBancosController extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	limpiaCampos = (lyt = true) => {
		lyt && this.acciones.selLayout.limpiar()
		this.acciones.selArchivo.limpiar()
		this.datos.tabla.limpiar()
	}

	rellenaBanco = async () => {
		await this.llenaListaBancos()
	}

	cambioBanco = async () => {
		this.limpiaCampos()
		this.modelo.banco = {
			id: this.acciones.selBanco.getValorSeleccionado(),
			nombre: this.acciones.selBanco.getTextoSeleccionado(),
		}
		await this.llenaListaLayouts(this.modelo.banco.id)

		if (this.layouts.length === 0) this.msjError("No hay layouts disponibles.")

		this.acciones.selArchivo.setMensaje("Selecciona un Layout.")
	}

	cambioLayout = () => {
		this.limpiaCampos(false)

		this.modelo.layout = this.layouts.find(
			layout => layout.id === Number(this.acciones.selLayout.getValorSeleccionado())
		)

		if (this.modelo.layout.extensiones === "")
			return this.msjError("El layout no indican las extensiones validas.")
		else this.acciones.selArchivo.setFormato(this.modelo.layout.extensiones.split(","))

		this.acciones.selArchivo.habilitaSelector()
		this.acciones.selArchivo.setMensaje("Oprime el botón para seleccionar un archivo.")
	}

	leerArchivo = async () => {
		if (this.acciones.selLayout.getValorSeleccionado() === "default") {
			this.msjError("Se debe seleccionar un layout.")
			return
		}

		const lecturaOK = await this.modelo.leerArchivo(this.acciones.selArchivo.ruta)

		if (lecturaOK) {
			const layoutOK = await this.modelo.aplicaLayout(
				this.acciones.selLayout.getValorSeleccionado()
			)

			if (layoutOK) {
				this.datos.tabla.setDetalles(
					Object.assign(
						{},
						this.modelo.informacion.apertura,
						this.modelo.informacion.cierre
					),
					this.formatoDetalles()
				)

				this.datos.tabla
					.parseaJSON(this.modelo.movimientos, null, this.formatoTabla())
					.actualizaTabla()

				this.acciones.guardar.setPropiedad("disabled", false)
				return
			}
		}

		this.msjError(this.modelo.mensaje)
	}

	guardar = async () => {
		this.modelo.setBanco(this.acciones.selBanco.getValor())
		this.modelo.setPeriodo(this.acciones.selPeriodo.getValor())
		this.modelo.setArchivo(this.acciones.selArchivo.ruta.name)
		this.modelo.setLayout(this.acciones.selLayout.getValor())

		this.msjContinuar(
			`Se guardará la información del archivo:<br><br>${this.modelo.archivo}<br><br>¿Deseas continuar?`,
			{
				txtSi: "Si, guardar",
				txtNo: "No, cancelar",
				callbackSi: this.modelo.pruebaAceptar,
			}
		)
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
