import Vista from "./vista.js"
import { RegTrnBancos as Controlador } from "../controllers/controladores.js"
import { RegTrnBancos as Modelo } from "../models/modelos.js"

import {
	Componente,
	LstPeriodo,
	SlctArchivo,
	TablaDatos,
	ListaDesplegable,
} from "../components/componentes.js"

export class RegTrnBancos extends Vista {
	constructor() {
		super("RegTrnBancos")
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Registro de Transacciones Bancarias")

		this.acciones.selPeriodo = new LstPeriodo()

		this.acciones.selBanco = new ListaDesplegable()
		this.acciones.selBanco.setTxtEtiqueta("Banco")
		this.acciones.selBanco.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new ListaDesplegable()
		this.acciones.selLayout.setTxtEtiqueta("Layout")
		this.acciones.selLayout.setListener("change", this.controlador.cambioLayout)

		this.acciones.selArchivo = new SlctArchivo()
		this.acciones.selArchivo.accionAbrir(this.controlador.leerArchivo)
		this.acciones.selArchivo.setMensaje("Selecciona un Banco y un Layout.")

		this.acciones.guardar = new Componente("section", {
			id: "contenedorGuardar",
			hijos: [(this.acciones.btnGuardar = new Componente("button"))],
		})
		this.acciones.btnGuardar.setTexto("Guardar").setPropiedad("disabled", "true")
		this.acciones.btnGuardar.setListener("click", this.controlador.guardar)

		this.datos.tabla = new TablaDatos()
		this.datos.tabla.mostrarFiltro = false

		this.controlador.cargaInicial()
		return this
	}
}

export default RegTrnBancos
