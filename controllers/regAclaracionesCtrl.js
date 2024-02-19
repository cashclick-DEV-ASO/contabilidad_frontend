import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegAclaracionesCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    buscar = async () => {
        this.datos.nota.setValor("")

        if (this.acciones.credito.getValor() === "100007378") {
            this.datos.nota.habilitarInput(true)
            this.acciones.guardar.habilitarBoton(true)
            return
        }

        this.datos.nota.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
        this.msjError("No se encontró información para el crédito solicitado.")
    }

    guardar = async () => {
        const nota = this.datos.nota.getValor()

        if (nota === "") return this.msjError("La nota de aclaración no puede estar vacía.")

        this.datos.nota.setValor("")
        this.datos.nota.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
        this.msjExito("La nota de aclaración se guardó correctamente.")
    }

    validaModificacion = () => {
        let habilita = true

        if (this.acciones.credito.getValor() === "") habilita = false
        if (this.acciones.credito.getValor().length != 9) habilita = false
        if (isNaN(this.acciones.credito.getValor())) habilita = false

        this.acciones.buscar.habilitarBoton(habilita)
    }
}

export default RegAclaracionesCtrl
