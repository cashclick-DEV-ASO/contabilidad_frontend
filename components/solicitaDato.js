import { Componente } from "./componentes.js"

import { SYS, SOLICITA_DATO } from "../src/constantes.js"
import { campoMoneda } from "../src/utils.js"

export class SolicitaDato extends Componente {
    constructor(tipo = SYS.TXT) {
        super(SYS.SCTN, { clase: SOLICITA_DATO.CONTENEDOR })

        this.txtEtiqueta = SOLICITA_DATO.TXT_ETIQUETA
        this.txtPlaceholder = SOLICITA_DATO.TXT_PLACEHOLDER
        this.fechaInicio = null
        this.boton = null
        this.tipo = tipo
        this.modoMoneda = false

        return this.inicia()
    }

    inicia() {
        this.setEstilo1()
        this.lbl = new Componente(SYS.LBL, { clase: SOLICITA_DATO.LBL })

        if (this.tipo === SYS.TXTAREA)
            this.dato = new Componente(SYS.TXTAREA, { clase: SOLICITA_DATO.IN })
        else this.dato = new Componente(SYS.IN, { clase: SOLICITA_DATO.IN })

        return this
    }

    configura() {
        this.vaciar()

        this.lbl.setTexto(this.txtEtiqueta)

        if (this.tipo !== SYS.TXTAREA) this.dato.setPropiedad("type", this.tipo)

        this.dato.vaciar()
        this.dato.setPropiedad(SYS.PH, this.txtPlaceholder)

        if (this.fechaInicio) this.dato.getComponente().valueAsDate = this.fechaInicio
        if (this.modoMoneda) campoMoneda(this.dato.getComponente())

        this.addHijos([
            this.lbl.mostrar(),
            this.dato.mostrar(),
            this.boton ? this.btn.mostrar() : null
        ])

        return this
    }

    mostrar() {
        return this.configura().getComponente()
    }

    reinicia() {
        if (this.fechaInicio) this.dato.getComponente().valueAsDate = this.fechaInicio
        else this.dato.getComponente().value = ""
        return this
    }

    setTxtEtiqueta(txt) {
        this.txtEtiqueta = txt
        return this
    }

    setTxtPlaceholder(txt) {
        this.txtPlaceholder = txt
        return this
    }

    setTipo(tipo) {
        this.tipo = tipo
        return this
    }

    setBoton(boton) {
        this.boton = boton
        return this
    }

    setValor(valor) {
        this.dato.setValor(valor)
        if (this.modoMoneda) campoMoneda(this.dato.getComponente(), true)
        return this
    }

    setValorFecha(valor) {
        const fechaRegexes = [
            /^\d{1,2}\/\d{1,2}\/\d{2}$/, // dd/mm/yy
            /^\d{1,2}\/\d{1,2}\/\d{4}$/, // dd/mm/yyyy
            /^\d{4}-\d{2}-\d{2}$/, // yyyy-mm-dd
            /^\d{1,2}-\d{1,2}-\d{2}$/, // yy-mm-dd
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/ // "2023-08-20T06:00:00.000Z"
        ]

        // if (valor instanceof Date) this.fechaInicio = valor.toISOString().split("T")[0]
        // else
        if (fechaRegexes.some((regex) => regex.test(valor))) this.fechaInicio = new Date(valor)
        else this.fechaInicio = valor

        return this
    }

    getValor() {
        if (this.tipo === SYS.DT) {
            const fecha = this.dato.getComponente().valueAsDate
            if (!fecha) return null
            return new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate())
        }
        if (this.tipo === SYS.NMBR) return parseFloat(this.dato.getValor()) || 0
        if (this.modoMoneda) return this.dato.getValor().replace(/[^\d.]/g, "")
        return this.dato.getValor()
    }

    getValorFecha() {
        return this.dato.getComponente().value
    }

    setListenerCambio(callback, evento = SYS.CHNG) {
        this.dato.setListener(evento, callback)
        return this
    }

    setPropiedad(propiedad, valor) {
        this.dato.setPropiedad(propiedad, valor)
        return this
    }

    setClaseDato(clase) {
        this.dato.setClase(clase)
        return this
    }

    setIDDato(id) {
        this.dato.setID(id)
        return this
    }

    setClaseLbl(clase) {
        this.dato.setClase(clase)
        return this
    }

    setIDLbl(id) {
        this.dato.setID(id)
        return this
    }

    habilitarInput(disabled) {
        this.dato.habilitar(disabled)
        return this
    }

    getClases() {
        return this.dato.getClases()
    }

    setModoMoneda(negativo = false) {
        const validos = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            ".",
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Tab",
            "Enter"
        ]
        this.modoMoneda = true

        this.dato
            .setListener(SYS.KDWN, (e) => {
                if (validos.includes(e.key)) return
                if (negativo && e.key === "-") return
                e.preventDefault()
            })
            .setListener(SYS.KUP, (e) => campoMoneda(e.target))
            .setListener(SYS.BLR, (e) => campoMoneda(e.target, true))
            .setPropiedad("style", "text-align: right")

        this.setTxtPlaceholder("$0.00")
        campoMoneda(this.dato.getComponente(), true)
        return this
    }

    setModoFecha() {
        this.dato
            .setPropiedad("min", "2020-01-01")
            .setPropiedad("max", new Date().toISOString().split("T")[0])
        this.setTipo(SYS.DT)
        this.setValorFecha(new Date().toISOString().split("T")[0])
        return this
    }
}

export default SolicitaDato
