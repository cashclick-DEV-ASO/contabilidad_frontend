import { FORMATOS_BBVA } from "../src/constantes.js"

import {
	Componente,
	SelPeriodo,
	SelArchivo,
	Tabla,
} from "../components/componentes.js"

export class RegTrnBancos extends Componente {
	constructor() {
		super("div", { clase: "cargaTrnBancos" })
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h2", { clase: "titulo" })
		this.selPeriodo = new SelPeriodo()
		this.selArchivo = new SelArchivo({ formato: FORMATOS_BBVA })
		this.selLayout = new Componente("seleccion", { clase: "layout" })
		this.tabla = new Tabla()
		return this
	}

	configura() {
		this.titulo.setTexto("Registro Transacciones Bancarias")
		this.selPeriodo.setEstilo2()

		this.selArchivo.btnSeleccionar.setListener("click", () => {
			const archivo = this.selArchivo.selArchivo.getComponente().files[0]

			const reader = new FileReader()
			reader.onload = e => {
				const contenido = e.target.result
				this.tabla.parseaTexto(contenido).actualizaTabla()
			}
			reader.readAsText(archivo)

			alert("Leyendo archivo...")
		})

		const op1 = new Componente("option")
		op1.setTexto("Layout 1")
		const op2 = new Componente("option")
		op2.setTexto("Layout 2")
		this.selLayout.addHijos([op1.getComponente(), op2.getComponente()])

		return this
	}

	crea() {
		this.addHijos([
			this.titulo.getComponente(),
			this.selPeriodo.mostrar(),
			this.selArchivo.mostrar(),
			this.selLayout.getComponente(),
			this.tabla.mostrar(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default RegTrnBancos
