import { Componente } from "./componentes.js"

import { SYS, LST } from "../src/constantes.js"

export class ListaDesplegable extends Componente {
    constructor({ phVacio = LST.PH_VACIO, phLleno = LST.PH_LLENO, mostrarPh = true } = {}) {
        super(SYS.SCTN, { clase: LST.CONTENEDOR })
        this.default = SYS.DFLT
        this.txtPhVacio = phVacio
        this.txtPhLleno = phLleno
        this.mostrarPh = mostrarPh
        this.bloqueaPh = false

        this.opciones = []

        return this.inicia()
    }

    inicia() {
        this.setEstilo1()
        this.lbl = new Componente(SYS.LBL, { clase: LST.LBL }).setTexto(LST.TXT_LBL)

        this.lista = new Componente(SYS.LST, { clase: LST.SLCT })

        this.placeholder = new Componente(SYS.OPT)

        return this
    }

    configura() {
        this.vaciar()

        this.configuraPlaceholder()

        this.lista.habilitar(!(this.opciones.length === 0))

        this.opciones.forEach((opcion) => {
            this.lista.addHijo(this.setOpcion(opcion).mostrar())
        })

        this.addHijos([this.lbl.mostrar(), this.lista.mostrar()])
        return this
    }

    mostrar() {
        return this.configura().getComponente()
    }

    setTxtEtiqueta(texto) {
        this.lbl.setTexto(texto)
        return this
    }

    configuraPlaceholder() {
        if (this.mostrarPh) {
            this.placeholder.setTexto(this.opciones.length ? this.txtPhLleno : this.txtPhVacio)
            this.placeholder.setValor(this.default)
            this.placeholder.setPropiedad("selected", true)
            this.placeholder.habilitar(this.bloqueaPh)
            this.lista.addHijo(this.placeholder.getComponente())
        }
    }

    actulizaOpciones(opciones = []) {
        this.opciones = opciones
        this.lista.vaciar()
        this.configuraPlaceholder()
        this.lista.habilitar(!(this.opciones.length === 0))
        opciones.forEach((opcion) => {
            this.lista.addHijo(this.setOpcion(opcion).mostrar())
        })
        return this
    }

    habilitarLista(habilitar) {
        this.lista.habilitar(habilitar)
        return this
    }

    setOpcion(atributos) {
        const opcion = new Componente(SYS.OPT)
        opcion.setTexto(atributos.texto)
        opcion.setValor(atributos.valor ?? atributos.texto)
        return opcion
    }

    setOpciones(opciones) {
        this.opciones = opciones
        return this
    }

    addOpcion(opcion) {
        this.addHijo(this.setOpcion(opcion).mostrar())
        return this
    }

    setTemporalPH(ph) {
        this.placeholder.setTexto(ph).mostrar()
        return this
    }

    setMostrarPh(mostrar) {
        this.mostrarPh = mostrar
        return this
    }

    setTxtPhVacio(placeholder) {
        this.txtPhVacio = placeholder
        return this
    }

    setTxtPhLleno(placeholder) {
        this.txtPhLleno = placeholder
        return this
    }

    reinicia() {
        this.lista.getComponente().value = this.default
        return this
    }

    getValorSeleccionado() {
        return this.lista.getComponente().value
    }

    getTextoSeleccionado() {
        return this.lista.getComponente().selectedOptions[0].textContent
    }

    getIndiceSeleccionado() {
        return this.lista.getComponente().selectedIndex
    }

    getNumeroOpciones() {
        return this.lista.getComponente().length
    }

    setSeleccionByIndice(valor) {
        this.lista.getComponente().selectedIndex = valor
        return this
    }

    setSeleccionByValor(valor) {
        this.lista.getComponente().value = valor
        return this
    }

    setSeleccionByTexto(texto) {
        this.lista.getComponente().value = texto
        return this
    }

    setBloquearPh(bloquear) {
        this.bloqueaPh = !bloquear
        return this
    }

    dfltSelecciondo() {
        return this.lista.getComponente().value === this.default
    }
}
