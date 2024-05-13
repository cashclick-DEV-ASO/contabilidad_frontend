import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConConciliacionCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: this.tipoMovimiento
        }
        this.formatoResumen = {
            Total_Abonos: this.formatoMoneda,
            Total_Cargos: this.formatoMoneda
        }
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

            const totales = res.datos.reduce(
                (sumas, val) => {
                    if (val.tipo == 2) {
                        sumas.Total_Abonos += parseFloat(val.monto)
                        sumas.Conteo_Abonos++
                    }
                    if (val.tipo == 1) {
                        sumas.Total_Cargos += parseFloat(val.monto)
                        sumas.Conteo_Cargos++
                    }
                    return sumas
                },
                { Total_Abonos: 0, Total_Cargos: 0, Conteo_Cargos: 0, Conteo_Abonos: 0 }
            )

            this.datos.tabla.setDetalles(totales, this.formatoResumen)
            this.datos.tabla
                .parseaJSON(res.datos, null, this.formatoTabla, ["id", "resultado"])
                .actualizaTabla()
        })
    }

    eliminar = (datos) => {
        this.msjContinuar("¿Está seguro de eliminar la correspondencia seleccionada?", {
            txtSi: "Si, eliminar",
            callbackSi: (cerrar) => {
                this.modelo.eliminar(datos).then((res) => {
                    if (!res.success) return mostrarError(res.mensaje)
                    this.msjExito("Correspondencia eliminada exitosamente.", (cerrar) => {
                        this.buscar()
                        if (cerrar) cerrar()
                    })
                })
                if (cerrar) cerrar()
            }
        })
    }
}

export default ConConciliacionCtrl
