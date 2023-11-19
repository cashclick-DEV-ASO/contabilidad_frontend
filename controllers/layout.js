import Controlador from "./controlador.js"

import { mostrarError } from "../src/utils.js"

export class LayoutController extends Controlador {
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
		this.acciones.selLayout.setTemporalPH("Cargando layout...")

		this.banco = this.bancos.find(
			banco => banco.valor === Number(this.acciones.selBanco.getValorSeleccionado())
		)

		if (this.banco === undefined) {
			this.msjError("No se encontró información del banco seleccionado.")
			return
		}

		this.llenaListaLayouts(this.banco.valor).then(() => {
			if (this.layouts.length === 0) {
				this.msjError("No hay layouts disponibles.")
				return
			}

			this.acciones.selLayout.actulizaOpciones(this.layouts)
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

		this.acciones.extensiones.setValor(this.layout.extension)
		this.acciones.tipo.setSeleccionByValor(this.layout.tipo)
		this.datos.editor.setValor(JSON.stringify(JSON.parse(this.layout.layout), null, 2))
	}

	informacionModificada = () => {
		const chek = () => {
			if (this.acciones.selBanco.getValorSeleccionado() === "default") return false
			if (this.acciones.selLayout.getValorSeleccionado() === "default") return false
			if (this.acciones.extensiones.getValor() === "") return false
			if (this.datos.editor.getValor() === "") return false
			return true
		}

		this.acciones.btnGuardar.habilitar(chek())
	}

	/**
	 * Limpia los campos de la vista.
	 * @param {Object} opciones - Opciones para limpiar los campos.
	 * @param {boolean} opciones.lyt - Indica si se debe limpiar el campo de selección de layout.
	 * @param {boolean} opciones.bnk - Indica si se debe limpiar el campo de selección de banco.
	 */
	limpiaCampos = ({ lyt = true, bnk = false } = {}) => {
		bnk && this.acciones.selBanco.reinicia()
		lyt && this.acciones.selLayout.reinicia()
		this.acciones.extensiones.setValor("")
		this.acciones.btnGuardar.habilitar(false)
		this.datos.editor.setValor("")
	}

	guardarCambios = async () => {
		try {
			JSON.parse(this.datos.editor.getValor())
		} catch (error) {
			return mostrarError(error)
		}

		const layout = this.layouts
		layout.extension = this.acciones.extensiones.getValor()
		layout.layout = this.datos.editor.getValor()

		await this.modelo.actualizaLayout(layout)

		if (this.modelo.resultado.success) {
			this.acciones.btnGuardar.habilitar(false)
			this.acciones.selLayout.setValor(layout.id)
			this.msjExito("El layout se ha actualizado correctamente.")
			this.limpiaCampos({ bnk: true })
		} else {
			this.msjError("No se pudo actualizar el layout.")
		}
	}

	nuevoLayout = async (e, cierre) => {
		if (this.mensaje.captura.getValor() === "") {
			this.msjError("Se debe indicar un alias para el nuevo layout.")
			return
		}

		const layout = {
			id_banco: this.acciones.selBanco.getValorSeleccionado(),
			alias: this.mensaje.captura.getValor(),
			extensiones: this.acciones.extensiones.getValor(),
			layout: this.datos.editor.getValor(),
		}

		await this.modelo.nuevoLayout(layout)

		if (this.modelo.resultado.success) {
			this.limpiaCampos()
			this.msjExito("El layout se ha registrado correctamente.")
			this.limpiaCampos({ bnk: true })
		} else {
			this.msjError("No se pudo registrar el layout.")
		}

		cierre()
	}

	solicitaNombre = async () => {
		if (!this.acciones.selBanco.getValorSeleccionado()) {
			this.msjError("Se debe seleccionar un banco.")
			return
		}

		if (this.acciones.extensiones.getValor() === "") {
			this.msjError("Se debe indicar las extensiones de archivo.")
			return
		}

		if (this.datos.editor.getValor() === "") {
			this.msjError("Se debe indicar el contenido del layout.")
			return
		}

		this.mensaje = this.msjSolicitar(
			"Indique el alias para el nuevo layout.",
			this.nuevoLayout.bind(this),
			"Alias"
		)
	}
}

export default LayoutController
