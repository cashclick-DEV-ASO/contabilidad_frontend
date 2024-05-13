import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ResSaldoFavorCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            monto_prestamo: this.formatoMoneda,
            monto_pagado: this.formatoMoneda,
            saldo_a_favor: this.formatoMoneda
        }
    }

    consultar = async () => {
        this.msjError("No se encontró información para los periodos seleccionados.")
        if (this.datos.tabla.getFilas().length > 0) {
            this.datos.tabla.limpiar()
            return
        }

        this.datos.tabla.parseaJSON([], null, this.formatoTabla).actualizaTabla()
    }
}

export default ResSaldoFavorCtrl
