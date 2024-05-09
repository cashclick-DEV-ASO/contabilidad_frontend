import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RecalculoInteresCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            monto_prestamo: this.formatoMoneda,
            tasa: this.formatoPorcentaje,
            interes_total: this.formatoMoneda,
            iva: this.formatoMoneda,
            parcialidad: this.formatoMoneda
        }
    }

    consultar = async () => {
        if (this.datos.tabla.getFilas().length > 0) {
            this.datos.tabla.limpiar()
            this.msjError("El recalculo no pudo ser generado.")
            return
        }

        this.datos.tabla
            .parseaJSON(
                [
                    {
                        id_credito: 1005235,
                        monto_prestamo: 100000,
                        tasa: 80,
                        plazo: 12,
                        interes_total: 80000,
                        iva: 12800,
                        parcialidad: 10540,
                        "18/01/2021": 10200,
                        "03/02/2021": 1150,
                        "18/02/2021": 10100,
                        "03/03/2021": 10050,
                        "18/03/2021": 10000
                    },
                    {
                        id_credito: 1005242,
                        monto_prestamo: 8000,
                        tasa: 80,
                        plazo: 6,
                        interes_total: 4800,
                        iva: 768,
                        parcialidad: 1330,
                        "20/01/2021": 1180,
                        "05/02/2021": 1050,
                        "20/03/2021": 920,
                        "05/04/2021": 790,
                        "20/04/2021": 660
                    }
                ],
                null,
                this.formatoTabla
            )
            .actualizaTabla()
        this.msjExito("Recalculo generado correctamente.")
    }
}

export default RecalculoInteresCtrl
