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

    consultar = async () => {
        return this.msjError(
            "No se encontró información de dispersión de créditos en el rango de periodos seleccionados."
        )
    }
}

export default RecalculoCapitalCtrl
