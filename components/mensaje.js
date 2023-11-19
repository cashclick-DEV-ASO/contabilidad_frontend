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
			NEUTRO: "msjNeutro",
			ERROR: "msjError",
			EXITO: "msjExito",
			ADVERTENCIA: "msjAdvertencia",
			INFORMACION: "msjInformacion",
			SOLICITAR: "msjSolicitar",
		}
		this.titulosDefault = {
			msjError: "Error",
			msjExito: "Éxito",
			msjAdvertencia: "Advertencia",
			msjInformacion: "Información",
			msjSolicitar: "Solicitud",
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

		this.txtTitulo = new Componente("span", { clase: "msjTitulo" }).setTexto(this.txtTtl)

		this.cerrar = new Componente("span", { clase: "msjCerrar" })
			.setTexto("❌")
			.setListener("click", this.ocultar.bind(this))

		this.mensaje = new Componente("section", { clase: "msjTexto" })

		this.txtMensaje = new Componente("span", { clase: "msjTexto" })

		this.captura = new Componente("input", { clase: "msjCaptura" }).setPropiedad("type", "text")

		this.botones = new Componente("section", { clase: "msjBotones" })

		return this
	}

	configura() {
		this.marco.setClase(this.tipoSolicitado)

		this.titulo.addHijos([
			this.txtTitulo.setTexto(this.txtTtl).getComponente(),
			this.cerrar.getComponente(),
		])

		this.mensaje.addHijos([
			this.txtMensaje.setTexto(this.txtMsj).getComponente(),
			this.tipo.SOLICITAR === this.tipoSolicitado ? this.captura.getComponente() : null,
		])

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
		if (this.botonesConfigurados.length === 0) this.addBoton("Aceptar", this.callback, true)
		return this.configura().insertarEnDOM()
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

	setPlaceholder(placeholder) {
		this.captura.setPropiedad("placeholder", placeholder)
		return this
	}

	setBoton(boton) {
		this.botonesConfigurados.push(boton)
		return this
	}

	setBotones(btns) {
		btns.forEach(boton => this.setBoton(boton))
		return this
	}

	addBoton(texto = "Aceptar", callback = null, focus = true) {
		const accion = callback ?? this.respuestaTrue

		const boton = new Componente("button", { clase: "msjBoton" })
			.setTexto(texto)
			.setListener("click", e => {
				accion(e, this.ocultar.bind(this))
			})

		if (focus) boton.setFoco()

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

	respuestaTrue = (e, cierre) => {
		this.setRespuesta(true)
		cierre()
	}

	respuestaFalse = (e, cierre) => {
		this.setRespuesta(false)
		cierre()
	}
}

export default Mensaje
