import Vista from "./vista.js"
import { Layout as Controlador } from "../controllers/controladores.js"
import { Layout as Modelo } from "../models/modelos.js"

import { SYS } from "../src/constantes.js"
import { Componente, ListaDesplegable, SolicitaDato } from "../components/componentes.js"

export class Layout extends Vista {
	constructor() {
		super("Layout")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Administración de Layout's")

		this.acciones.nuevo = new Componente(SYS.SCTN, {
			id: "contenedorNuevo",
			hijos: [(this.acciones.btnNuevo = new Componente(SYS.BTN, { clase: "btnNuevo" }))],
		})
		this.acciones.btnNuevo.setTexto("Nuevo")
		this.acciones.btnNuevo.setListener(SYS.CLK, this.controlador.solicitaNombre)

		this.acciones.selBanco = new ListaDesplegable()
			.setTxtEtiqueta("Banco")
			.setID("banco")
			.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new ListaDesplegable()
			.setTxtEtiqueta("Layout")
			.setID("layout")
			.setListener("change", this.controlador.cambioLayout)

		this.acciones.tipo = new ListaDesplegable()
			.setTxtEtiqueta("Tipo")
			.setID("tipo")
			.setOpciones([
				{ texto: "excel", valor: "excel" },
				{ texto: "delimitado", valor: "delimitado" },
				{ texto: "fijo", valor: "fijo" },
				{ texto: "json", valor: "json" },
				{ texto: "xml", valor: "xml" },
			])

		this.acciones.extensiones = new SolicitaDato()
			.setTxtEtiqueta("Extensiones")
			.setTxtPlaceholder("txt,csv,xls")
			.setTipo("text")
			.setListener(SYS.IN, this.controlador.informacionModificada)
			.setID("extensiones")

		this.acciones.contenedorGuardar = new Componente(SYS.SCTN, {
			clase: "contenedorGuardar",
			hijos: [(this.acciones.btnGuardar = new Componente(SYS.BTN, { clase: "btnGuardar" }))],
		})
		this.acciones.btnGuardar
			.setTexto("Guardar")
			.setPropiedad(SYS.DSBL, "true")
			.setListener(SYS.CLK, this.controlador.guardarCambios)

		this.datos.contenedorEditor = new Componente(SYS.SCTN, {
			clase: "contenedorEditor",
			hijos: [(this.datos.editor = new Componente("textarea", { clase: "editor" }))],
		})

		this.datos.editor
			.setPropiedad("spellcheck", "false")
			.setListener(SYS.IN, this.controlador.informacionModificada)

		this.controlador.cargaInicial()
		return this
	}
}

export default Layout
