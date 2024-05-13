import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConAclaracionesCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_valor: this.formatoFecha
        }
    }

    cargaInicial = async () => {
        this.acciones.estatus.setOpciones([
            { texto: "Abierto", valor: 1 },
            { texto: "Cerrado", valor: 2 }
        ])
    }

    buscar = async () => {
        let msj = this.msjProcesando("Consultando aclaraciones...")
        this.datos.tabla.limpiar()

        this.modelo.buscar().then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(resultado.mensaje)
            if (res.datos.length === 0)
                return this.msjAdvertencia(
                    "No se encontraron aclaraciones para los criterios seleccionados."
                )

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla, ["id"]).actualizaTabla()
        })
    }
}

export default ConAclaracionesCtrl
