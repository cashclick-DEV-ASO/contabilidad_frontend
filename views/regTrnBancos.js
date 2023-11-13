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
	constructor() {
		super("div", { clase: "regTrnBancos" })
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("h2", { clase: "titulo" })
		this.selBanco = new SelBanco()
		this.selPeriodo = new SelPeriodo()
		this.selArchivo = new SelArchivo({ formato: FORMATOS_BBVA })
		this.selLayout = new SelLayout()
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

		this.selLayout.setOpciones([
			{ texto: "Cobranza", valor: "1" },
			{ texto: "Dispersiones", valor: "2" },
			{ texto: "Domiciliaciones", valor: "3" },
		])

		return this
	}

	crea() {
		this.addHijos([
			this.titulo.getComponente(),
			this.selBanco.mostrar(),
			this.selPeriodo.mostrar(),
			this.selArchivo.mostrar(),
			this.selLayout.mostrar(),
			this.tabla.mostrar(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default RegTrnBancos
