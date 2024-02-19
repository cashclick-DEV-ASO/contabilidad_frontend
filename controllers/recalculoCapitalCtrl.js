import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RecalculoCapitalCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            monto_prestamo: this.formatoMoneda,
            parcialidad: this.formatoMoneda
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
            this.msjError("El recalculo no pudo ser generado.")
            return
        }

        this.datos.tabla
            .parseaJSON(
                [
                    {
                        id_credito: 1005235,
                        monto_prestamo: 100000,
                        plazo: 12,
                        parcialidad: 10540,
                        "01/01/2021": 0,
                        "01/02/2021": 0,
                        "01/03/2021": 0,
                        "01/04/2021": 0,
                        "01/05/2021": 0,
                        "01/06/2021": 0,
                        "01/07/2021": 0,
                        "01/08/2021": 0,
                        "01/09/2021": 0,
                        "18/01/2021": 10200,
                        "03/02/2021": 1150,
                        "18/02/2021": 10100,
                        "03/03/2021": 10050,
                        "18/03/2021": 10000
                    },
                    {
                        id_credito: 1005242,
                        monto_prestamo: 8000,
                        plazo: 6,
                        parcialidad: 1330,
                        "01/01/2021": 0,
                        "01/02/2021": 0,
                        "01/03/2021": 0,
                        "01/04/2021": 0,
                        "01/05/2021": 0,
                        "01/06/2021": 0,
                        "01/07/2021": 0,
                        "01/08/2021": 0,
                        "01/09/2021": 0,
                        "18/01/2021": 1180,
                        "03/02/2021": 1050,
                        "18/02/2021": 920,
                        "03/03/2021": 790,
                        "18/03/2021": 660
                    }
                ],
                null,
                this.formatoTabla
            )
            .actualizaTabla()
        this.msjExito("Recalculo generado correctamente.")
    }
}

export default RecalculoCapitalCtrl
