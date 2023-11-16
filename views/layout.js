import Vista from "./vista.js"
import { Layout as Controlador } from "../controllers/controladores.js"
import { Layout as Modelo } from "../models/modelos.js"

import { Componente, ListaDesplegable, SelBanco, SelLayout } from "../components/componentes.js"

export class Layout extends Vista {
	constructor() {
		super()
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h2", { clase: "titulo" })
		this.titulo.setTexto("Administración de Layout's")

		this.btnNuevo = new Componente("button", { clase: "btnNuevo" })
		this.btnNuevo.setTexto("Nuevo")
		this.btnNuevo.setListener("click", this.controlador.solicitaNombre)
		this.acciones.nuevo = new Componente("section", { clase: "nuevo" }).addHijo(
			this.btnNuevo.mostrar()
		)

		this.acciones.selBanco = new SelBanco()
		this.acciones.selBanco.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new SelLayout()
		this.acciones.selLayout.setListener("change", this.controlador.cambioLayout)

		this.lblExtensiones = new Componente("label", {
			clase: "lblExtensiones",
		})
		this.lblExtensiones.setTexto("Extensiones")
		this.extensiones = new Componente("input", { clase: "extensiones" })
		this.extensiones.setPropiedad("type", "text")
		this.extensiones.setListener("input", this.controlador.informacionModificada)
		this.acciones.contenedorExt = new Componente("section", {
			clase: "contenedorExt",
		}).addHijos([this.lblExtensiones.mostrar(), this.extensiones.mostrar()])

		this.btnGuardar = new Componente("button", { clase: "btnGuardar" })
		this.btnGuardar.setTexto("Guardar")
		this.btnGuardar.setPropiedad("disabled", "true")
		this.btnGuardar.setListener("click", this.controlador.guardarCambios)
		this.contenedorGuardar = new Componente("section", {
			clase: "contenedorGuardar",
		}).addHijo(this.btnGuardar.mostrar())

		this.lblTipo = new Componente("label", { clase: "lblTipo" })
		this.lblTipo.setTexto("Tipo")
		this.tipo = new ListaDesplegable()
		this.tipo.setOpciones([
			{ texto: "excel", valor: "excel" },
			{ texto: "delimitado", valor: "delimitado" },
			{ texto: "fijo", valor: "fijo" },
			{ texto: "json", valor: "json" },
			{ texto: "xml", valor: "xml" },
		])
		this.acciones.contenedorTipo = new Componente("section", {
			clase: "contenedorTipo",
		}).addHijos([this.lblTipo.mostrar(), this.tipo.mostrar()])

		this.datos.contenedorEditor = new Componente("section", {
			clase: "contenedorEditor",
		})
		this.editor = new Componente("textarea", { clase: "editor" })
		this.editor.setPropiedad("contenteditable", "true")
		this.editor.setPropiedad("spellcheck", "false")
		this.editor.setPropiedad("autocorrect", "off")
		this.editor.setPropiedad("autocapitalize", "off")
		this.editor.setPropiedad("autocomplete", "off")
		this.editor.setPropiedad("wrap", "off")
		this.editor.setListener("input", this.controlador.informacionModificada)

		this.controlador.cargaInicial()
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}
}

export default Layout
