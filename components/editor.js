import { MSJ_CONTENEDOR_CLS } from "../src/constantes.js"
import Botonera from "./botonera.js"

import { SYS } from "../src/constantes.js"
import { Componente, ListaDesplegable, SolicitaDato } from "../components/componentes.js"

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

        this.datos.setPropiedad(
            "style",
            `grid-template-columns: repeat(${
                this.campos.length > 5 ? 5 : this.campos.length
            }, 1fr);`
        )

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
        if (tipo == "text" && valor && valor.includes("||")) {
            const opciones = valor.split("||")
            opciones.forEach((opcion, i) => {
                const dato = new SolicitaDato()
                dato.setTxtEtiqueta(`${titulo} ${i + 1}`)
                    .setTipo("text")
                    .setValor(opcion)
                    .setClaseDato("pieza")
                this.campos.push(dato)
                this.datos.addHijo(dato.mostrar())
            })
            return this
        }
        const dato = new SolicitaDato()
        dato.setTxtEtiqueta(titulo).setTipo(tipo)
        if (tipo === "date")
            dato.setValorFecha(
                valor ||
                    new Date().toLocaleDateString("es-MX", {
                        timeZone: "America/Mexico_City",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    })
            )
        else dato.setValor(valor)
        this.campos.push(dato)
        this.datos.addHijo(dato.mostrar())
        return this
    }

    getCampos() {
        let campos = []
        let piezas = []
        let indice = undefined

        this.campos.forEach((campo, i) => {
            if (campo.getClases().contains("pieza")) {
                indice = indice === undefined ? i : indice
                piezas.push(campo.getValor())
            } else campos.push(campo)
        })

        if (piezas.length > 0) {
            campos.splice(indice, 0, {
                getValor: () => piezas.join("||")
            })
        }

        return campos
    }

    campoEspecial(campo, valor = null) {
        if (campo instanceof SolicitaDato) {
            if (campo.tipo === "date")
                campo.setValorFecha(
                    valor ||
                        new Date().toLocaleDateString("es-MX", {
                            timeZone: "America/Mexico_City",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        })
                )
            else campo.setValor(valor || "")
        }

        this.campos.push(campo)
        this.datos.addHijo(campo.mostrar())

        if (campo instanceof ListaDesplegable && valor) {
            campo.setSeleccionByTexto(valor)
            if (campo.getValorSeleccionado() === SYS.DFLT) campo.setSeleccionByValor(valor)
        }
        return this
    }
}
