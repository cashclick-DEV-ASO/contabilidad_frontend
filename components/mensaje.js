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
            PROCESANDO: "msjProcesando"
        }
        this.titulosDefault = {
            msjError: "Error",
            msjExito: "Éxito",
            msjAdvertencia: "Advertencia",
            msjInformacion: "Información",
            msjSolicitar: "Solicitud",
            msjProcesando: "Procesando"
        }
        this.tipoSolicitado = tipo ?? this.tipo.INFORMACION
        this.listo = false
        this.botonesConfigurados = []
        this.respuesta = null
        this.callback = null
        this.permiteCerrar = true

        return this.inicia()
    }

    inicia() {
        this.marco = new Componente("div", { clase: "msjMarco" })

        this.txtTitulo = new Componente("section", { clase: "msjTitulo" })

        this.titulo = new Componente("span", { clase: "titulo" }).setTexto(this.txtTtl)

        this.cerrar = new Componente("span", { clase: "cerrar" })
            .setTexto("❌")
            .setListener("click", this.ocultar.bind(this))

        this.txtMensaje = new Componente("section", { clase: "msjTexto" })

        this.mensaje = new Componente("span", { clase: "texto" })

        this.captura = new Componente("input", { clase: "msjCaptura" }).setPropiedad("type", "text")

        this.botones = new Componente("section", { clase: "msjBotones" })

        return this
    }

    configura() {
        this.marco.setClase(this.tipoSolicitado)

        this.txtTitulo.addHijos([
            this.titulo.setTexto(this.txtTtl).getComponente(),
            this.permiteCerrar ? this.cerrar.getComponente() : null
        ])

        this.txtMensaje.addHijo(this.mensaje.setTexto(this.txtMsj).getComponente())

        if (this.botonesConfigurados.length > 0) {
            this.botonesConfigurados.forEach((boton) => {
                this.botones.addHijo(boton.getComponente())
            })
        }

        this.addHijos([
            this.marco
                .addHijos([
                    this.txtTitulo.getComponente(),
                    this.txtMensaje.getComponente(),
                    this.tipo.SOLICITAR === this.tipoSolicitado
                        ? this.captura.getComponente()
                        : null,
                    this.botones.getComponente()
                ])
                .getComponente()
        ])

        return this
    }

    mostrar(bntDftl = true) {
        if (this.botonesConfigurados.length === 0 && bntDftl)
            this.addBoton("Aceptar", this.callback, true)
        this.configura().insertarEnDOM()
        return this
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
        btns.forEach((boton) => this.setBoton(boton))
        return this
    }

    setPermiteCerrar(permiteCerrar) {
        this.permiteCerrar = permiteCerrar
        return this
    }

    addBoton(texto = "Aceptar", callback = null, focus = true) {
        const accion = callback ?? this.respuestaTrue

        const boton = new Componente("button", { clase: "msjBoton" })
            .setTexto(texto)
            .setListener("click", () => {
                accion(this.ocultar.bind(this))
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

    respuestaTrue = (cierre) => {
        this.setRespuesta(true)
        cierre()
    }

    respuestaFalse = (cierre) => {
        this.setRespuesta(false)
        cierre()
    }
}

export default Mensaje
