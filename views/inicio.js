import Componente from "../components/componente.js"

import { escribirCookie, leerCookie } from "../src/utils.js"
const LOGO = new URL("../images/Cashclick_logo.svg", import.meta.url).href
const LUZ_ON = new URL("../images/Dark_on.svg", import.meta.url).href
const LUZ_OFF = new URL("../images/Dark_off.svg", import.meta.url).href

/**
 * Clase que representa la vista de inicio del sistema de contabilidad integral de Cashclick.
 * @extends Componente
 * @constructor
 */
export class Inicio extends Componente {
	constructor() {
		super("section", { id: "inicio" })
		this.resolucionOK = true
		this.modoSeleccionado = leerCookie("MODO")
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
			Le damos la bienvenida al sistema de contabilidad integral de
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
			¿Está listo para empezar?, seleccione una opción del menú superior.
			</p>
			<br>
			<p>
			¡Que tenga ${this.textoSaludo()}!
			<br>
			</p>
			</strong>
			<br>
			<small>
			<p>
			Su navegador actual es: ${this.iconosNavegadores()}
			<br>
			Su resolución actual es: ${this.validacionResolucion()}
			</p>
			${
				this.resolucionOK
					? ""
					: "<p>Para una mejor experiencia, te sugerimos utilizar Google Chrome o Microsoft Edge y tener una resolución de pantalla de 1280 x 720 o superior.</p>"
			}
			</small>`
		)

		this.modo = new Componente("img", { id: "modo" })
		this.modo.setPropiedad("alt", "Cambiar modo oscuro")
		this.modo.setListener("click", this.cambiarModo.bind(this))
		this.validaModoOscuro()

		this.instruccion = new Componente("span", { id: "instruccion" }).setTexto(
			this.actualizaRecomendacion()
		)

		this.addHijos([
			this.bienvenida.mostrar(),
			this.imagen.mostrar(),
			this.recomendacion.mostrar(),
			this.instruccion.mostrar(),
			this.modo.mostrar(),
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

	validaModoOscuro() {
		const body = document.body

		if (this.modoSeleccionado === "oscuro") {
			this.modo.setPropiedad("src", LUZ_OFF)
			this.modo.setClase("invertir")
			escribirCookie("MODO", "oscuro")
			body.classList.add("oscuro")
		}

		if (this.modoSeleccionado === "claro") {
			this.modo.setPropiedad("src", LUZ_ON)
			escribirCookie("MODO", "claro")
			this.modo.removeClase("invertir")
			body.classList.add("claro")
		}

		this.modo.setPropiedad("src", LUZ_OFF)
		this.modo.setClase("invertir")
		body.classList.add("oscuro")
	}

	cambiarModo() {
		const body = document.body
		const instruccion = document.getElementById("instruccion")

		if (body.classList.contains("oscuro")) {
			this.modoSeleccionado = "claro"
			body.classList.remove("oscuro")
			body.classList.add("claro")
			escribirCookie("MODO", "claro")
			this.modo.removeClase("invertir")
			this.modo.setPropiedad("src", LUZ_ON)
			instruccion.innerHTML = this.actualizaRecomendacion()
			return
		}
		if (body.classList.contains("claro")) {
			this.modoSeleccionado = "oscuro"
			body.classList.remove("claro")
			body.classList.add("oscuro")
			this.modo.setPropiedad("src", LUZ_OFF)
			this.modo.setClase("invertir")
			escribirCookie("MODO", "oscuro")
			instruccion.innerHTML = this.actualizaRecomendacion()
			return
		}
	}

	actualizaRecomendacion() {
		return `<br><strong>
			<p>
			Haga clic en el icono para ${this.modoSeleccionado === "oscuro" ? "encender" : "apagar"} la luz.
			</p>
			</strong>
			<br>`
	}
}

export default Inicio
