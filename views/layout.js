import Vista from "./vista.js"
import { Layout as Controlador } from "../controllers/controladores.js"
import { Layout as Modelo } from "../models/modelos.js"

import { Componente, ListaDesplegable, LstBanco, LstLayout } from "../components/componentes.js"

export class Layout extends Vista {
	constructor() {
		super()
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h2", { clase: "titulo" })
		this.titulo.setTexto("Administración de Layout's")

		this.acciones.nuevo = new Componente("section", {
			clase: "contenedorNuevo",
			hijos: [(this.acciones.btnNuevo = new Componente("button", { clase: "btnNuevo" }))],
		})
		this.acciones.btnNuevo.setTexto("Nuevo")
		this.acciones.btnNuevo.setListener("click", this.controlador.solicitaNombre)

		this.acciones.selBanco = new LstBanco()
		this.acciones.selBanco.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new LstLayout()
		this.acciones.selLayout.setListener("change", this.controlador.cambioLayout)

		this.acciones.contenedorExt = new Componente("section", {
			clase: "contenedorExt",
			hijos: [
				(this.acciones.lblExtensiones = new Componente("label", {
					clase: "lblExtensiones",
				})),
				(this.acciones.extensiones = new Componente("input", { clase: "extensiones" })),
			],
		})
		this.acciones.lblExtensiones.setTexto("Extensiones")
		this.acciones.extensiones.setPropiedad("type", "text")
		this.acciones.extensiones.setListener("input", this.controlador.informacionModificada)

		this.acciones.contenedorGuardar = new Componente("section", {
			clase: "contenedorGuardar",
			hijos: [(this.acciones.btnGuardar = new Componente("button", { clase: "btnGuardar" }))],
		})
		this.acciones.btnGuardar.setTexto("Guardar")
		this.acciones.btnGuardar.setPropiedad("disabled", "true")
		this.acciones.btnGuardar.setListener("click", this.controlador.guardarCambios)

		this.acciones.contenedorTipo = new Componente("section", {
			clase: "contenedorTipo",
			hijos: [
				(this.acciones.lblTipo = new Componente("label", { clase: "lblTipo" })),
				(this.acciones.tipo = new ListaDesplegable()),
			],
		})
		this.acciones.lblTipo.setTexto("Tipo")
		this.acciones.tipo.setOpciones([
			{ texto: "excel", valor: "excel" },
			{ texto: "delimitado", valor: "delimitado" },
			{ texto: "fijo", valor: "fijo" },
			{ texto: "json", valor: "json" },
			{ texto: "xml", valor: "xml" },
		])

		this.datos.contenedorEditor = new Componente("section", {
			clase: "contenedorEditor",
			hijos: [(this.datos.editor = new Componente("textarea", { clase: "editor" }))],
		})
		this.datos.editor.setPropiedad("contenteditable", "true")
		this.datos.editor.setPropiedad("spellcheck", "false")
		this.datos.editor.setPropiedad("autocorrect", "off")
		this.datos.editor.setPropiedad("autocapitalize", "off")
		this.datos.editor.setPropiedad("autocomplete", "off")
		this.datos.editor.setPropiedad("wrap", "off")
		this.datos.editor.setListener("input", this.controlador.informacionModificada)

		this.controlador.datosInicio()
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}
}

export default Layout
