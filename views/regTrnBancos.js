import { RegTrnBancos as Controlador } from "../controllers/controladores.js"

import { FORMATOS_BBVA } from "../src/constantes.js"

import {
	Componente,
	SelBanco,
	SelPeriodo,
	SelArchivo,
	SelLayout,
	Tabla,
} from "../components/componentes.js"

export class RegTrnBancos extends Componente {
	#controlador

	constructor() {
		super("div", { clase: "regTrnBancos" })
		this.#controlador = new Controlador(this)

		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h2", { clase: "titulo" })
		this.selPeriodo = new SelPeriodo()
		this.selBanco = new SelBanco()
		this.selLayout = new SelLayout()
		this.selArchivo = new SelArchivo()
		this.contenedorGuardar = new Componente("section", {
			clase: "contenedorGuardar",
		})
		this.guardar = new Componente("button", { clase: "btnGuardar" })
		this.tabla = new Tabla()
		return this
	}

	configura() {
		this.titulo.setTexto("Registro de Transacciones Bancarias")
		this.selPeriodo.setEstilo2()

		this.selBanco.setListener("change", this.#controlador.cambioBanco)

		this.selLayout.selLayout.setListener(
			"change",
			this.#controlador.cambioLayout
		)

		this.selArchivo.accionAbrir(this.#controlador.leerArchivo)
		this.selArchivo.setMensaje("Selecciona un Banco y un Layout.")

		this.guardar.setTexto("Guardar")
		this.guardar.setPropiedad("disabled", "true")
		this.guardar.setListener("click", this.#controlador.guardar)

		this.tabla.mostrarFiltro = true
		return this
	}

	crea() {
		this.addHijos([
			this.titulo.getComponente(),
			this.selPeriodo.mostrar(),
			this.selBanco.mostrar(),
			this.selLayout.mostrar(),
			this.selArchivo.mostrar(),
			this.contenedorGuardar
				.addHijos([this.guardar.getComponente()])
				.getComponente(),
			this.tabla.mostrar(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default RegTrnBancos
