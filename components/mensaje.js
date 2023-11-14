import { MSJ_CONTENEDOR_CLS } from "../src/constantes.js"

import Componente from "./componente.js"

/**
 * @class Mensaje
 * @extends Componente
 * @param {string} tipo - Clase para el contenedor del mensaje
 * @description Componente para mostrar mensajes en pantalla
 */
export class Mensaje extends Componente {
	constructor(tipo = null) {
		super("div", { clase: MSJ_CONTENEDOR_CLS })

		this.txtTtl = "Mensaje de sistema"
		this.txtMsj = ""
		this.tipo = {
			ERROR: "msjError",
			EXITO: "msjExito",
			ADVERTENCIA: "msjAdvertencia",
			INFORMACION: "msjInformacion",
		}
		this.titulosDefault = {
			msjError: "Error",
			msjExito: "Éxito",
			msjAdvertencia: "Advertencia",
			msjInformacion: "Información",
		}
		this.tipoSolicitado = tipo ?? this.tipo.INFORMACION
		this.listo = false
		this.botonesConfigurados = []
		this.respuesta = null
		this.callback = null

		return this.inicia()
	}

	inicia() {
		this.marco = new Componente("div", { clase: "msjMarco" })

		this.titulo = new Componente("section", { clase: "msjTitulo" })
		this.txtTitulo = new Componente("span", { clase: "msjTitulo" })
		this.cerrar = new Componente("span", { clase: "msjCerrar" })

		this.mensaje = new Componente("section", { clase: "msjTexto" })
		this.txtMensaje = new Componente("span", { clase: "msjTexto" })

		this.botones = new Componente("section", { clase: "msjBotones" })

		return this
	}

	configura() {
		this.marco.setClase(this.tipoSolicitado)

		this.txtTitulo.setTexto(this.txtTtl)
		this.cerrar.setTexto("X")
		this.cerrar.setListener("click", this.ocultar.bind(this))

		this.txtMensaje.setTexto(this.txtMsj)
		return this
	}

	crea() {
		this.titulo.addHijos([
			this.txtTitulo.getComponente(),
			this.cerrar.getComponente(),
		])

		this.mensaje.addHijo(this.txtMensaje.getComponente())

		if (this.botonesConfigurados.length > 0) {
			this.botonesConfigurados.forEach(boton => {
				this.botones.addHijo(boton.getComponente())
			})
		}

		this.addHijos([
			this.marco
				.addHijos([
					this.titulo.getComponente(),
					this.mensaje.getComponente(),
					this.botones.getComponente(),
				])
				.getComponente(),
		])

		return this
	}

	mostrar() {
		if (this.botonesConfigurados.length === 0)
			this.addBoton("Aceptar", this.callback)
		return this.configura().crea().insertarEnDOM()
	}

	ocultar() {
		this.removeComponente()
		this.botonesConfigurados = []
		this.botones.vaciar()
		return this
	}

	setMensaje(mensaje) {
		this.txtMsj = mensaje
		return this
	}

	setTipo(tipo) {
		this.tipoSolicitado = tipo
		this.txtTtl = this.titulosDefault[tipo]
		return this
	}

	setTitulo(titulo) {
		this.txtTtl = titulo
		return this
	}

	setBoton(accion) {
		this.botonesConfigurados.push(boton)
		return this
	}

	setBotones(btns) {
		btns.forEach(boton => this.setBoton(boton))
		return this
	}

	addBoton(texto = "Aceptar", callback = null) {
		const accion = callback ?? this.setRespuesta.bind(this, true)

		const boton = new Componente("button", { clase: "msjBoton" })
		boton.setTexto(texto)
		boton.setListener("click", e => {
			accion(e)
			this.ocultar.bind(this)()
		})

		this.botonesConfigurados.push(boton)

		return this
	}

	setRespuesta(respuesta) {
		this.respuesta = respuesta
		return this
	}

	setCallback(callback) {
		this.callback = callback
		return this
	}
}

export default Mensaje
