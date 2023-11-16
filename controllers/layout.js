import Controlador from "./controlador.js"

import { Layout as LayoutMdl } from "../models/modelos.js"
import { mostrarError } from "../src/utils.js"

export class LayoutController extends Controlador {
	constructor(vista) {
		super(vista, new LayoutMdl())
		this.bancos = []
		this.layouts = []
	}

	rellenaBanco = async () => {
		await this.llenaBanco()
	}

	cambioBanco = async () => {
		this.limpiaCampos()
		this.llenaLayout(this.vista.selBanco.getValor())
	}

	cambioLayout = () => {
		this.limpiaCampos({ lyt: false })
		const layout = this.layouts.find(layout => layout.id == this.vista.selLayout.getValor())
		this.vista.extensiones.setValor(layout.extensiones)
		if (layout.layout) {
			let texto = layout.layout
			try {
				texto = JSON.stringify(JSON.parse(layout.layout), null, 2)
			} catch (e) {
				mostrarError("El layout no es un JSON válido, se muestra el texto plano.")
			}

			this.vista.editor.setValor(texto)
		}
	}

	informacionModificada = () => {
		this.vista.guardar.habilitar(true)
	}

	/**
	 * Limpia los campos de la vista.
	 * @param {Object} opciones - Opciones para limpiar los campos.
	 * @param {boolean} opciones.lyt - Indica si se debe limpiar el campo de selección de layout.
	 * @param {boolean} opciones.bnk - Indica si se debe limpiar el campo de selección de banco.
	 */
	limpiaCampos = ({ lyt = true, bnk = false } = {}) => {
		bnk && this.vista.selBanco.reinicia()
		lyt && this.vista.selLayout.limpiar()
		this.vista.extensiones.setValor("")
		this.vista.editor.setValor("")
		this.vista.guardar.habilitar(false)
	}

	guardarCambios = async () => {
		const layout = this.layouts.find(layout => layout.id == this.vista.selLayout.getValor())
		layout.extensiones = this.vista.extensiones.getValor()
		layout.layout = this.vista.editor.getValor()

		await this.modelo.actualizaLayout(layout)

		if (this.modelo.success) {
			this.vista.guardar.habilitar(false)
			this.vista.selLayout.setValor(layout.id)
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
			id_banco: this.vista.selBanco.getValorSeleccionado(),
			alias: this.mensaje.captura.getValor(),
			extensiones: this.vista.extensiones.getValor(),
			layout: this.vista.editor.getValor(),
		}

		await this.modelo.nuevoLayout(layout)

		if (this.modelo.success) {
			this.limpiaCampos()
			this.msjExito("El layout se ha registrado correctamente.")
			this.limpiaCampos({ bnk: true })
		} else {
			this.msjError("No se pudo registrar el layout.")
		}

		cierre()
	}

	solicitaNombre = async () => {
		if (!this.vista.selBanco.getValorSeleccionado()) {
			this.msjError("Se debe seleccionar un banco.")
			return
		}

		if (this.vista.extensiones.getValor() === "") {
			this.msjError("Se debe indicar las extensiones de archivo.")
			return
		}

		if (this.vista.editor.getValor() === "") {
			this.msjError("Se debe indicar el contenido del layout.")
			return
		}

		this.msjSolicitar(
			"Indique el alias para el nuevo layout.",
			this.nuevoLayout.bind(this),
			"Alias"
		)
	}
}

export default LayoutController
