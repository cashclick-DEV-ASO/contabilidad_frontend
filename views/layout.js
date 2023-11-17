import Vista from "./vista.js"
import { Layout as Controlador } from "../controllers/controladores.js"
import { Layout as Modelo } from "../models/modelos.js"

import { Componente, ListaDesplegable } from "../components/componentes.js"

export class Layout extends Vista {
	constructor() {
		super("Layout")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Administración de Layout's")

		this.acciones.nuevo = new Componente("section", {
			id: "contenedorNuevo",
			hijos: [(this.acciones.btnNuevo = new Componente("button", { clase: "btnNuevo" }))],
		})
		this.acciones.btnNuevo.setTexto("Nuevo")
		this.acciones.btnNuevo.setListener("click", this.controlador.solicitaNombre)

		this.acciones.selBanco = new ListaDesplegable()
			.setTxtEtiqueta("Banco")
			.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new ListaDesplegable()
			.setTxtEtiqueta("Layout")
			.setListener("change", this.controlador.cambioLayout)

		this.acciones.contenedorExt = new Componente("section", {
			id: "contenedorExt",
			hijos: [
				(this.acciones.lblExtensiones = new Componente("label", {
					id: "lblExtensiones",
				})),
				(this.acciones.extensiones = new Componente("input", { clase: "extensiones" })),
			],
		})

		this.acciones.lblExtensiones
			.setTexto("Extensiones")
			.setPropiedad("type", "text")
			.setListener("input", this.controlador.informacionModificada)

		this.acciones.contenedorGuardar = new Componente("section", {
			clase: "contenedorGuardar",
			hijos: [(this.acciones.btnGuardar = new Componente("button", { clase: "btnGuardar" }))],
		})

		this.acciones.btnGuardar
			.setTexto("Guardar")
			.setPropiedad("disabled", "true")
			.setListener("click", this.controlador.guardarCambios)

		this.acciones.tipo = new ListaDesplegable().setTxtEtiqueta("Tipo").setOpciones([
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

		this.datos.editor
			.setPropiedad("contenteditable", "true")
			.setPropiedad("spellcheck", "false")
			.setPropiedad("autocorrect", "off")
			.setPropiedad("autocapitalize", "off")
			.setPropiedad("autocomplete", "off")
			.setPropiedad("wrap", "off")
			.setListener("input", this.controlador.informacionModificada)

		this.controlador.cargaInicial()
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}
}

export default Layout
