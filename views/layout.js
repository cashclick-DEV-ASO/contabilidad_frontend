import { Layout as LayoutCtrl } from "../controllers/controladores.js"

import { Componente, SelBanco, SelLayout } from "../components/componentes.js"

export class Layout extends Componente {
	#controlador

	constructor() {
		super("section", { clase: "contenedorLayout" })
		this.#controlador = new LayoutCtrl(this)

		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h2", { clase: "titulo" })
		this.selBanco = new SelBanco()
		this.selLayout = new SelLayout()

		this.contenedorExt = new Componente("section", {
			clase: "contenedorExt",
		})
		this.lblExtensiones = new Componente("label", {
			clase: "lblExtensiones",
		})
		this.extensiones = new Componente("input", { clase: "extensiones" })
		this.contenedorGuardar = new Componente("section", {
			clase: "contenedorGuardar",
		})
		this.guardar = new Componente("button", { clase: "btnGuardar" })
		this.contenedorNuevo = new Componente("section", {
			clase: "contenedorNuevo",
		})
		this.nuevo = new Componente("button", { clase: "btnNuevo" })
		this.contenedorEditor = new Componente("section", {
			clase: "contenedorEditor",
		})
		this.editor = new Componente("textarea", { clase: "editor" })

		return this
	}

	configura() {
		this.titulo.setTexto("Administración de Layout's")

		this.#controlador.rellenaBanco()
		this.selBanco.setListener("change", this.#controlador.cambioBanco)
		this.selLayout.setListener("change", this.#controlador.cambioLayout)

		this.lblExtensiones.setTexto("Extensiones:")
		this.extensiones.setPropiedad("type", "text")
		this.extensiones.setListener(
			"input",
			this.#controlador.informacionModificada
		)

		this.editor.setPropiedad("contenteditable", "true")
		this.editor.setPropiedad("spellcheck", "false")
		this.editor.setPropiedad("autocorrect", "off")
		this.editor.setPropiedad("autocapitalize", "off")
		this.editor.setPropiedad("autocomplete", "off")
		this.editor.setPropiedad("wrap", "off")
		this.editor.setListener(
			"input",
			this.#controlador.informacionModificada
		)

		this.guardar.setTexto("Guardar")
		this.guardar.setPropiedad("disabled", "true")
		this.guardar.setListener("click", this.#controlador.guardarCambios)

		this.nuevo.setTexto("Nuevo")
		this.nuevo.setListener("click", this.#controlador.solicitaNombre)

		return this
	}

	crea() {
		this.addHijos([
			this.titulo.getComponente(),
			this.selBanco.mostrar(),
			this.contenedorExt
				.addHijos([
					this.lblExtensiones.getComponente(),
					this.extensiones.getComponente(),
				])
				.getComponente(),
			this.contenedorNuevo
				.addHijo(this.nuevo.getComponente())
				.getComponente(),
			this.selLayout.mostrar(),
			this.contenedorGuardar
				.addHijo(this.guardar.getComponente())
				.getComponente(),
			this.contenedorEditor
				.addHijo(this.editor.getComponente())
				.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default Layout
