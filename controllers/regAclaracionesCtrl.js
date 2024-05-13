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
        this.modelo.consultar(this.acciones.credito.getValor()).then((r) => {
            if (r.error) return this.msjError(r.error)

            if (r.datos.length === 0) {
                this.msjError("No se encontraron datos para el crédito ingresado.")
                return
            }

            this.datos.noCred.setValor(r.datos[0].noCredito)
            this.datos.noClnt.setValor(r.datos[0].noCliente)
            this.datos.capital.setValor(r.datos[0].capital)
            this.datos.interes.setValor(r.datos[0].interes)
            this.datos.fechaInicio.setValor(r.datos[0].fecha)
            this.datos.ultimoPago.setValor(r.datos[0].ultimo_pago)

            this.datos.nota.habilitarInput(true)
            this.acciones.guardar.habilitarBoton(true)
        })
    }

    guardar = async () => {
        const nota = this.datos.nota.getValor()

        if (nota === "") return this.msjError("La nota de aclaración no puede estar vacía.")

        this.modelo.guardar({ credito: this.datos.noCred.getValor(), nota }).then((r) => {
            if (r.error) return this.msjError(r.error)

            this.datos.nota.setValor("")
            this.datos.nota.habilitarInput(false)
            this.acciones.guardar.habilitarBoton(false)
            this.msjExito("La nota de aclaración se guardó correctamente.")
        })
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
