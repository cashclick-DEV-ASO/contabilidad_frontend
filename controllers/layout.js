import Controlador from "./controlador.js"

import { Layout as LayoutMdl } from "../models/modelos.js"

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
		this.llenaLayout(this.vista.selBanco.selBanco.getValor())
	}

	cambioLayout = () => {
		this.limpiaCampos(false)
		const layout = this.layouts.find(
			layout => layout.id == this.vista.selLayout.selLayout.getValor()
		)
		this.vista.extensiones.setValor(layout.extensiones)
		if (layout.layout) {
			this.vista.editor.setTexto(
				JSON.stringify(JSON.parse(layout.layout), null, 2)
			)
		}
	}

	informacionModificada = () => {
		this.vista.guardar.habilitar(true)
	}

	limpiaCampos = (lyt = true) => {
		lyt && this.vista.selLayout.limpiar()
		this.vista.extensiones.setValor("")
		this.vista.editor.setTexto("")
		this.vista.guardar.habilitar(false)
	}

	guardarCambios = async () => {
		const layout = this.layouts.find(
			layout => layout.id == this.vista.selLayout.selLayout.getValor()
		)
		layout.extensiones = this.vista.extensiones.getValor()
		layout.layout = this.vista.editor.getTexto()

		await this.modelo.actualizaLayout(layout)

		if (this.modelo.success) {
			this.vista.guardar.habilitar(false)
			this.vista.selLayout.selLayout.setValor(layout.id)
			this.msjExito("El layout se ha actualizado correctamente.")
		} else {
			this.msjError("No se pudo actualizar el layout.")
		}
	}

	nuevoLayout = async (e, cierre) => {
		if (this.mensaje.captura.getValor() === "") {
			this.msjError(
				"Se debe indicar un alias para el nuevo layout."
			).mostrar()
			return
		}

		const layout = {
			id_banco: this.vista.selBanco.selBanco.getValorSeleccionado(),
			alias: this.mensaje.captura.getValor(),
			extensiones: this.vista.extensiones.getValor(),
			layout: this.vista.editor.getValor(),
		}

		await this.modelo.nuevoLayout(layout)

		if (this.modelo.success) {
			this.limpiaCampos()
			this.msjExito("El layout se ha registrado correctamente.").mostrar()
		} else {
			this.msjError("No se pudo registrar el layout.").mostrar()
		}

		cierre()
	}

	solicitaNombre = async () => {
		if (!this.vista.selBanco.selBanco.getValorSeleccionado()) {
			this.msjError("Se debe seleccionar un banco.").mostrar()
			return
		}

		if (this.vista.extensiones.getValor() === "") {
			this.msjError(
				"Se debe indicar las extensiones de archivo."
			).mostrar()
			return
		}

		if (this.vista.editor.getValor() === "") {
			this.msjError("Se debe indicar el contenido del layout.").mostrar()
			return
		}

		this.msjSolicitar(
			"Indique el alias para el nuevo layout.",
			this.nuevoLayout.bind(this),
			"Alias"
		).mostrar()
	}
}

export default LayoutController
