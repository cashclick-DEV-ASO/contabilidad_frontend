import { MSJ_CONTENEDOR_CLS } from "../src/constantes.js"
import Botonera from "./botonera.js"

import Componente from "./componente.js"
import SolicitaDato from "./solicitaDato.js"

/**
 * @class Mensaje
 * @extends Componente
 * @param {string} tipo - Clase para el contenedor del mensaje
 * @description Componente para mostrar mensajes en pantalla
 */
export class Editor extends Componente {
    constructor() {
        super("div", { clase: "modalEditor" })

        this.botonesConfigurados = []
        this.callback = null
        this.txtTtl = "Modificación de datos"
        this.txtModificar = "Modificar"
        this.txtEliminar = "Eliminar"
        this.txtCancelar = "Cancelar"
        this.callbackModificar = null
        this.callbackEliminar = null
        this.campos = []
    }

    inicia() {
        this.marco = new Componente("div", { clase: "modalMarco" })

        this.txtTitulo = new Componente("section", { clase: "modalTitulo" })

        this.titulo = new Componente("span", { clase: "titulo" }).setTexto(this.txtTtl)

        this.cerrar = new Componente("span", { clase: "cerrar" })
            .setTexto("❌")
            .setListener("click", this.ocultar.bind(this))

        this.datos = new Componente("section", { clase: "modalDatos" })

        this.botones = new Componente("section", { clase: "modalBotones" })

        return this
    }

    configura() {
        this.marco.setClase("Solicitud")

        this.txtTitulo.addHijos([
            this.titulo.setTexto(this.txtTtl).getComponente(),
            this.cerrar.getComponente()
        ])

        if (this.botonesConfigurados.length > 0) {
            this.botonesConfigurados.forEach((boton) => {
                this.botones.addHijo(boton.getComponente())
            })
        }

        this.addHijos([
            this.marco
                .addHijos([
                    this.txtTitulo.getComponente(),
                    this.datos.getComponente(),
                    this.botones.getComponente()
                ])
                .getComponente()
        ])

        return this
    }

    setAccionModificar(accion) {
        this.callbackModificar = accion
        return this
    }

    setAccionEliminar(accion) {
        this.callbackEliminar = accion
        return this
    }

    mostrar(bntDftl = true) {
        if (this.callbackModificar) this.addBoton(this.txtModificar, this.callbackModificar, true)
        if (this.callbackEliminar) this.addBoton(this.txtEliminar, this.callbackEliminar, false)
        this.addBoton(this.txtCancelar, (cierra) => cierra())
        this.configura().insertarEnDOM()
        return this
    }

    ocultar() {
        this.removeComponente()
        this.botonesConfigurados = []
        this.botones.vaciar()
        return this
    }

    addBoton(texto = "Aceptar", callback = null, focus = true) {
        const accion = callback ?? this.respuestaTrue

        const boton = new Componente("button", { clase: "modalBoton" })
            .setTexto(texto)
            .setListener("click", () => {
                accion(this.ocultar.bind(this))
            })

        if (focus) boton.setFoco()

        this.botonesConfigurados.push(boton)

        return this
    }

    addCampos(datos = []) {
        datos.forEach((dato) => {
            addDato(dato.titulo, dato.valor)
        })

        return this
    }

    addCampo(titulo, valor, tipo = "text") {
        const dato = new SolicitaDato()
        dato.setTxtEtiqueta(titulo).setTipo(tipo)
        if (tipo === "date") dato.setValorFecha(valor || new Date())
        else dato.setValor(valor)
        this.campos.push(dato)
        this.datos.addHijo(dato.mostrar())
        return this
    }

    getCampos() {
        return this.campos
    }
}
