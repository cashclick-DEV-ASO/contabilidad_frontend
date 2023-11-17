import Vista from "./vista.js"
import { RegTrnBancos as Controlador } from "../controllers/controladores.js"
import { RegTrnBancos as Modelo } from "../models/modelos.js"

import {
	Componente,
	LstPeriodo,
	LstBanco,
	LstLayout,
	SlctArchivo,
	TablaDatos,
} from "../components/componentes.js"

export class RegTrnBancos extends Vista {
	constructor() {
		super()
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Registro de Transacciones Bancarias")

		this.acciones.selPeriodo = new LstPeriodo()
		this.acciones.selPeriodo.setEstilo2()

		this.acciones.selBanco = new LstBanco()
		this.acciones.selBanco.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new LstLayout()
		this.acciones.selLayout.selLayout.setListener("change", this.controlador.cambioLayout)

		this.acciones.selArchivo = new SlctArchivo()
		this.acciones.selArchivo.accionAbrir(this.controlador.leerArchivo)
		this.acciones.selArchivo.setMensaje("Selecciona un Banco y un Layout.")

		this.acciones.guardar = new Componente("section", {
			id: "contenedorGuardar",
			hijos: [(this.acciones.btnGuardar = new Componente("button"))],
		})
		this.acciones.btnGuardar.setTexto("Guardar")
		// this.btnGuardar.setPropiedad("disabled", "true")
		this.acciones.btnGuardar.setListener("click", this.controlador.guardar)

		this.datos.tabla = new TablaDatos()
		this.datos.tabla.mostrarFiltro = true

		this.controlador.cargaInicial()
		return this
	}
}

export default RegTrnBancos
