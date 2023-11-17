import Componente from "../components/componente.js"

import { leerCookie } from "../src/utils.js"
const LOGO = new URL("../images/Cashclick_logo.svg", import.meta.url).href

/**
 * Clase que representa la vista de inicio del sistema de contabilidad integral de Cashclick.
 * @extends Componente
 * @constructor
 */
export class Inicio extends Componente {
	constructor() {
		super("section", { id: "inicio" })
		this.resolucionOK = true
		return this.inicia()
	}

	inicia() {
		this.bienvenida = new Componente("span", { id: "spnBienvenida" })
		this.bienvenida.setTexto(
			`<strong>
			<p>
			Hola,  ${leerCookie("NOMBRE")}.
			</p>
			<br>
			<p>
			Te damos la bienvenida al sistema de contabilidad integral de
			</p>
			</strong>`
		)

		this.imagen = new Componente("img", { id: "logo" })
		this.imagen.setPropiedad("src", LOGO)
		this.imagen.setPropiedad("alt", "Logo Cashclick")

		this.recomendacion = new Componente("span", {
			id: "contenedorRecomendacion",
		})
		this.recomendacion.setTexto(
			`<strong>
			<p>
			¿Estás listo para empezar?, Selecciona una opción del menú superior.
			</p>
			<br>
			<p>
			¡Que tengas ${this.textoSaludo()}!
			<br>
			</p>
			</strong>
			<br>
			<small>
			<p>
			Tu navegador actual es: ${this.iconosNavegadores()}
			<br>
			Tu resolución actual es: ${this.validacionResolucion()}
			</p>
			${
				this.resolucionOK
					? ""
					: "<p>Para una mejor experiencia, te sugerimos utilizar Google Chrome o Microsoft Edge y tener una resolución de pantalla de 1280 x 720 o superior.</p>"
			}
			</small>`
		)

		this.addHijos([
			this.bienvenida.mostrar(),
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
		this.resolucionOK = ancho >= 1280 && alto >= 720
		const icono = this.resolucionOK ? "✅" : "❌"
		return `${ancho} x ${alto} ${icono}`
	}
}

export default Inicio
