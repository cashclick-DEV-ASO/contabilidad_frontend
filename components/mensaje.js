import Componente from "./componente.js"

import Div from "./div.js"
import Span from "./span.js"

/**
 * @Description Clase para mostrar mensajes en pantalla.
 */
export class Mensaje extends Componente {
    constructor(clase = "msjContenedor") {
        super(document.createElement("div"), clase)
        this.configura()
        this.iniciarElementos()
    }

    configura() {
        this.txtTitulo = "Mensaje de sistema"
        this.txtMensaje = ""
        this.tipos = {
            error: "msjError",
            exito: "msjExito",
            advertencia: "msjAdvertencia",
            informacion: "msjInformacion"
        }
        this.titulosDefault = {
            msjError: "Error",
            msjExito: "Éxito",
            msjAdvertencia: "Advertencia",
            msjInformacion: "Información"
        }
        this.tipo = this.tipos.informacion
        this.listo = false
        this.botones = []
    }

    setMensaje(mensaje) {
        this.txtMensaje = mensaje
        return this
    }

    setTipo(tipo) {
        this.tipo = tipo
        this.txtTitulo = this.titulosDefault[tipo]
        return this
    }

    setTitulo(titulo) {
        this.txtTitulo = titulo
        return this
    }

    setBotones(botones) {
        this.botones = botones
        return this
    }

    iniciarElementos() {
        this.marco = new Div("msjMarco")
        this.titulo = new Span("", "msjTitulo")
        this.cerrar = new Span("", "msjCerrar")
        this.mensaje = new Span("", "msjTexto")
    }

    configurarElementos() {
        this.marco.addClase(this.tipo)
        this.titulo.setTexto(this.txtTitulo)
        this.cerrar.setTexto("X")
        this.cerrar.addListener("click", this.ocultar)
        this.mensaje.setTexto(this.txtMensaje)
    }

    integrarElementos() {
        this.configurarElementos()
        this.marco.appendChild(this.titulo.elemento)
        this.marco.appendChild(this.cerrar.elemento)
        this.marco.appendChild(this.mensaje.elemento)
        this.botones.forEach(boton => {
            this.marco.appendChild(boton.elemento)
        })
        this.elemento.appendChild(this.marco.elemento)
    }

    mostrar() {
        this.integrarElementos()
        document.querySelector("body").appendChild(this.elemento)
    }

    ocultar() {
        document.querySelector(".msjContenedor").remove()
    }
}

export default Mensaje