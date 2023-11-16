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
		this.nombre.setTexto(`Bienvenido ${leerCookie("NOMBRE")}`)

		this.imagen = new Componente("img", { clase: "logo" })
		this.imagen.setPropiedad("src", logo)
		this.imagen.setPropiedad("alt", "Logo Cashclick")

		this.mensaje = new Componente("span", { clase: "msjBienvenida" })
		this.mensaje.setTexto("al sistema de gestión contable integral.")

		this.recomendacion = new Componente("span", {
			clase: "msjRecomendacion",
		})
		this.recomendacion.setTexto(
			`<p>
			<strong>
			Para comenzar, selecciona una opción del menú superior.
			<br>
			¡Que tengas ${this.textoSaludo()}!
			</strong>
			<br>
			</p>
			<br>
			<p><small>
			Para una mejor experiencia, te sugerimos usar Google Chrome o Microsoft Edge y ajustar la resolución de tu pantalla a 1280 x 720 o más.
			</small></p>
			<br>
			<p><small>
			Tu navegador actual es: ${this.iconosNavegadores()}
			<br>
			Tu resolución actual es: ${this.validacionResolucion()}
			</small></p>`
		)

		this.addHijos([
			this.nombre.mostrar(),
			this.mensaje.mostrar(),
			this.imagen.mostrar(),
			this.recomendacion.mostrar(),
		])

		return this
	}

	mostrar() {
		return this.getComponente()
	}

	iconosNavegadores() {
		const navegador = navigator.userAgent
		if (navegador.includes("Chrome")) return "Chrome ✅"
		if (navegador.includes("Firefox")) return "Firefox ✅"
		if (navegador.includes("Edge")) return "Edge ✅"
		if (navegador.includes("Safari")) return "Safari ✅"
		if (navegador.includes("Opera")) return "Opera ✅"
		if (navegador.includes("Trident")) return "Internet Explorer ❌"

		return "Desconocido"
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
