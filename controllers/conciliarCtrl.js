import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConciliarCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.transacciones = []
        this.formatoTabla = {
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: this.formatoTipo
        }
    }

    cambiaFechaI = () => {
        if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
            this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
    }

    cambiaFechaF = () => {
        if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
            this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
    }

    buscar = () => {
        this.acciones.concilia.habilitarBoton(false)
        this.acciones.guardar.habilitarBoton(false)
        let msj = this.msjProcesando("Consultando transacciones...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor()
        }

        this.modelo.buscarTransacciones(datos).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(res.mensaje)

            if (res.datos.length === 0) {
                this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )
                return
            }

            this.transacciones = res.datos

            this.datos.tabla
                .parseaJSON(this.transacciones, null, this.formatoTabla, ["id"])
                .actualizaTabla()

            this.acciones.concilia.habilitarBoton(true)
        })
    }

    conciliar = () => {
        const msj = this.msjProcesando("Procesando conciliación automática...")
        this.acciones.concilia.habilitarBoton(true)
        this.acciones.guardar.habilitarBoton(false)

        const creditos = {}
        this.transacciones.forEach((transaccion) => {
            creditos[transaccion.credito] = creditos[transaccion.credito] || {}
            creditos[transaccion.credito][transaccion.tipo] =
                creditos[transaccion.credito][transaccion.tipo] || []
            creditos[transaccion.credito][transaccion.tipo].push(transaccion)
        })

        let trnOK = []

        Object.keys(creditos).forEach((credito) => {
            if (
                !creditos[credito][1] ||
                creditos[credito][1].length < 1 ||
                !creditos[credito][2] ||
                creditos[credito][2].length < 1
            )
                return

            creditos[credito][1].forEach((abono) => {
                for (let indexC = 0; indexC < creditos[credito][2].length; indexC++) {
                    const cargo = creditos[credito][2][indexC]
                    if (
                        parseFloat(abono.monto) === parseFloat(cargo.monto) ||
                        parseFloat(abono.monto) + parseFloat(cargo.monto) === 0
                    ) {
                        abono.resultado = "OK"
                        cargo.resultado = "OK"
                        trnOK.push(abono)
                        trnOK.push(cargo)

                        creditos[credito][2].splice(indexC, 1)
                        break
                    }
                }
            })
        })

        if (trnOK.length === 0) {
            msj.ocultar()
            return this.msjAdvertencia("No se encontraron transacciones a conciliar.")
        }

        this.transacciones = trnOK

        this.datos.tabla
            .parseaJSON(this.transacciones, null, this.formatoTabla, ["id"])
            .actualizaTabla()

        msj.ocultar()
        this.acciones.concilia.habilitarBoton(false)
        this.acciones.guardar.habilitarBoton(true)
    }

    guardar = () => {
        let msj = this.msjProcesando("Guardando transacciones...")
        this.modelo.guardarConciliado(this.conciliado).then((res) => {
            msj.ocultar()

            if (!res.success) {
                this.acciones.concilia.habilitarBoton(false)
                this.acciones.guardar.habilitarBoton(false)
                this.datos.tabla.limpiar()
                return this.msjError(res.mensaje)
            }

            this.msjExito(res.mensaje)
        })
    }
}

export default ConciliarCtrl
