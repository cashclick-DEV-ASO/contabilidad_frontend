import { leerCookie } from "../src/utils.js"

import Componente from "../components/componente.js"

const logo = new URL("../images/Cashclick_logo.svg", import.meta.url).href

export class Inicio extends Componente {
	constructor() {
		super("section", { clase: "inicio" })
		return this.inicia()
	}

	inicia() {
		this.nombre = new Componente("span", { clase: "msjBienvenida" })
		this.imagen = new Componente("img", { clase: "logo" })
		this.mensaje = new Componente("span", { clase: "msjBienvenida" })
		this.recomendacion = new Componente("span", {
			clase: "msjRecomendacion",
		})
		return this
	}

	configura() {
		this.nombre.setTexto(`Bienvenido ${leerCookie("NOMBRE")}`)

		this.imagen.setPropiedad("src", logo)
		this.imagen.setPropiedad("alt", "Logo Cashclick")

		this.mensaje.setTexto("al sistema de gestión contable integral.")

		this.recomendacion.setTexto(
			`<p>
			<strong>Para comenzar, selecciona una opción del menú superior.
			<br>
			¡Que tengas ${this.textoSaludo()}!</strong>
			<br>
			</p>
			<br>
			<p>
			<small>Para una mejor experiencia, te recomendamos utilizar Google Chrome y una resolución de pantalla minima de 1280 x 720.</small>
			</p>
			<p><small>Tu resolución actual es: ${this.validacionResolucion()}<small></p>`
		)
		return this
	}

	crea() {
		this.addHijos([
			this.nombre.getComponente(),
			this.mensaje.getComponente(),
			this.imagen.getComponente(),
			this.recomendacion.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}

	textoSaludo() {
		const hora = new Date().getHours()
		if (hora < 12) return "un excelente día"
		if (hora < 18) return "una excelente tarde"
		return "una excelente noche"
	}

	validacionResolucion() {
		const ancho = window.innerWidth
		const alto = window.innerHeight
		const icono = ancho >= 1280 && alto >= 720 ? "✅" : "❌"
		return `${ancho} x ${alto} ${icono}`
	}
}

export default Inicio
