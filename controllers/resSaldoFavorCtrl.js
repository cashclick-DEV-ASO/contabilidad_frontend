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

    formatoMoneda = (dato) => {
        const numero = parseFloat(dato)
        if (isNaN(numero)) return dato

        return numero.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        })
    }

    consultar = async () => {
        if (this.datos.tabla.getFilas().length > 0) {
            this.datos.tabla.limpiar()
            this.msjError("No se encontró información para los periodos seleccionados.")
            return
        }

        this.datos.tabla
            .parseaJSON(
                [
                    {
                        id_cliente: 423423,
                        id_credito: 1005235,
                        monto_prestamo: 100000,
                        monto_pagado: 100230,
                        saldo_a_favor: 230
                    },
                    {
                        id_cliente: 423867,
                        id_credito: 1005687,
                        monto_prestamo: 5000,
                        monto_pagado: 5145.23,
                        saldo_a_favor: 145.23
                    },
                    {
                        id_cliente: 425692,
                        id_credito: 1005688,
                        monto_prestamo: 10000,
                        monto_pagado: 10052,
                        saldo_a_favor: 52
                    }
                ],
                null,
                this.formatoTabla
            )
            .actualizaTabla()
    }
}

export default ResSaldoFavorCtrl
