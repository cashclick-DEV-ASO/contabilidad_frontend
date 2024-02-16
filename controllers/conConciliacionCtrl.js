import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConConciliacionCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_creacion: this.formatoFecha,
            fecha_valor: this.formatoFecha,
            monto: this.formatoModena,
            tipo: (dato) => {
                const tipos = ["No Identificado", "Cargo", "Abono"]
                return tipos[dato]
            }
        }
    }

    formatoModena = (dato) => {
        const numero = parseFloat(dato)
        if (isNaN(numero)) return dato

        return numero.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        })
    }

    formatoFecha = (dato) => {
        return new Date(dato).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    buscar = () => {
        let msj = this.msjProcesando("Consultando transacciones conciliadas...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor()
        }

        this.modelo.buscar(datos).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(resultado.mensaje)

            if (res.datos.length === 0) {
                this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )
                return
            }

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla).actualizaTabla()
        })
    }
}

export default ConConciliacionCtrl
