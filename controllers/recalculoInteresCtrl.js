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
        return this.msjError(
            "No se encontraron créditos que cumplan con los criterios de búsqueda."
        )
    }
}

export default RecalculoInteresCtrl
