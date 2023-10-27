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
        this.tipo = tipo ?? this.tipos.informacion
        this.listo = false
        this.botones = []
        return this
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

    inicia() {
        this.marco = new Componente("div", { clase: "msjMarco" })
        this.titulo = new Componente("span", { clase: "msjTitulo" })
        this.cerrar = new Componente("span", { clase: "msjCerrar" })
        this.mensaje = new Componente("span", { clase: "msjTexto" })
        return this
    }

    configura() {
        this.marco.setClase(this.tipo)
        this.titulo.setTexto(this.txtTitulo)
        this.cerrar.setTexto("X")
        this.cerrar.setListener("click", this.ocultar.bind(this))
        this.mensaje.setTexto(this.txtMensaje)
        return this
    }

    crea() {
        this.marco.addHijos([
            this.titulo.getComponente(),
            this.cerrar.getComponente(),
            this.mensaje.getComponente(),
        ])
        // this.botones.forEach(boton => {
        //     this.marco.appendChild(boton.elemento)
        // })
        this.addHijo(this.marco.getComponente())
        return this
    }

    mostrar() {
        const msj = this.inicia()
            .configura()
            .crea()
        document.querySelector("body").appendChild(msj.getComponente())
    }

    ocultar() {
        this.removeComponente()
    }
}

export default Mensaje