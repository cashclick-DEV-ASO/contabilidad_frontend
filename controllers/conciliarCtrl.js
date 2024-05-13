import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConciliarCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.transacciones = []
        this.trnOK = []
        this.formatoTabla = {
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: this.tipoMovimiento
        }
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

        this.modelo.buscar(datos).then((res) => {
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

        this.trnOK = []
        this.transacciones = []

        Object.keys(creditos).forEach((credito) => {
            if (
                !creditos[credito][1] ||
                creditos[credito][1].length < 1 ||
                !creditos[credito][2] ||
                creditos[credito][2].length < 1
            )
                return

            creditos[credito][2].forEach((abono) => {
                const a = {}
                for (let indexC = 0; indexC < creditos[credito][1].length; indexC++) {
                    const cargo = creditos[credito][1][indexC]
                    const c = {}
                    if (
                        parseFloat(abono.monto) === parseFloat(cargo.monto) ||
                        parseFloat(abono.monto) + parseFloat(cargo.monto) === 0
                    ) {
                        a.resultado = cargo.id
                        a.correspondencia = cargo.origen
                        a.origen = abono.origen
                        a.id = abono.id

                        c.resultado = abono.id
                        c.correspondencia = abono.origen
                        c.origen = cargo.origen
                        c.id = cargo.id

                        this.trnOK.push(a)
                        this.trnOK.push(c)

                        cargo.resultado = "OK"
                        abono.resultado = "OK"
                        this.transacciones.push(abono)
                        this.transacciones.push(cargo)

                        creditos[credito][2].splice(indexC, 1)
                        break
                    }
                }
            })

            creditos[credito][2].forEach((abono) => {
                if (abono.resultado === "OK") return
                const a = {}
                const cargosTMP = []
                let montoC = 0

                for (let indexC = 0; indexC < creditos[credito][1].length; indexC++) {
                    const cargo = creditos[credito][1][indexC]

                    if (cargo.resultado === "OK") break

                    cargosTMP.push(cargo)
                    montoC += parseFloat(cargo.monto)
                    if (montoC.toFixed(2) === parseFloat(abono.monto).toFixed(2)) {
                        a.resultado = cargo.id
                        a.correspondencia = cargo.origen
                        a.origen = abono.origen
                        a.id = abono.id
                        this.trnOK.push(a)
                        abono.resultado = "OK"
                        this.transacciones.push(abono)

                        cargosTMP.forEach((c) => {
                            const crg = {}
                            crg.resultado = abono.id
                            crg.correspondencia = abono.origen
                            crg.origen = c.origen
                            crg.id = c.id

                            this.trnOK.push(crg)
                            c.resultado = "OK"
                            this.transacciones.push(c)
                        })
                        break
                    }
                }
            })
        })

        if (this.trnOK.length === 0) {
            msj.ocultar()
            return this.msjAdvertencia("No se encontraron transacciones a conciliar.")
        }

        this.datos.tabla
            .parseaJSON(this.transacciones, null, this.formatoTabla, ["id"])
            .actualizaTabla()

        msj.ocultar()
        this.acciones.concilia.habilitarBoton(false)
        this.acciones.guardar.habilitarBoton(true)
    }

    guardar = () => {
        let msj = this.msjProcesando("Guardando transacciones...")
        this.modelo.guardar(this.trnOK).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(res.mensaje)

            this.acciones.concilia.habilitarBoton(false)
            this.acciones.guardar.habilitarBoton(false)
            this.datos.tabla.limpiar()
            this.msjExito(res.mensaje)
        })
    }
}

export default ConciliarCtrl
