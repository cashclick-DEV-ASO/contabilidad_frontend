import Vista from "./vista.js"
import { RegTrnBancos as Controlador } from "../controllers/controladores.js"
import { RegTrnBancos as Modelo } from "../models/modelos.js"

import {
	Componente,
	SelBanco,
	SelPeriodo,
	SelArchivo,
	SelLayout,
	Tabla,
} from "../components/componentes.js"

export class RegTrnBancos extends Vista {
	constructor() {
		super()
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto("Registro de Transacciones Bancarias")

		this.acciones.selPeriodo = new SelPeriodo()
		this.acciones.selPeriodo.setEstilo2()

		this.acciones.selBanco = new SelBanco()
		this.acciones.selBanco.setListener("change", this.controlador.cambioBanco)

		this.acciones.selLayout = new SelLayout()
		this.acciones.selLayout.selLayout.setListener("change", this.controlador.cambioLayout)

		this.acciones.selArchivo = new SelArchivo()
		this.acciones.selArchivo.accionAbrir(this.controlador.leerArchivo)
		this.acciones.selArchivo.setMensaje("Selecciona un Banco y un Layout.")

		this.btnGuardar = new Componente("button", { clase: "btnGuardar" })
		this.btnGuardar.setTexto("Guardar")
		this.btnGuardar.setPropiedad("disabled", "true")
		this.btnGuardar.setListener("click", this.controlador.guardar)

		this.acciones.guardar = new Componente("section", { clase: "contenedorGuardar" }).addHijo(
			this.btnGuardar.mostrar()
		)

		this.datos.tabla = new Tabla()
		this.datos.tabla.mostrarFiltro = true

		this.controlador.cargaInicial()
		return this
	}
}

export default RegTrnBancos
