import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"
import { SolicitaDato } from "../components/componentes.js"

export class ConNoConciliacionCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.marcados = []
        this.formatoTabla = {
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: this.tipoMovimiento,
            conciliar: () => {
                const chk = new SolicitaDato()
                    .setTipo("checkbox")
                    .setTxtEtiqueta("")
                    .setID("resultado")
                    .setEstilo2()
                    .setListener(SYS.CHNG, this.resumenAvance)

                return chk
            }
        }
        this.formatoResumen = {
            Monto_Abonos: this.formatoMoneda,
            Monto_Cargos: this.formatoMoneda
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

            this.datos.tabla.setDetalles(
                {
                    Cargos_Marcados: 0,
                    Monto_Cargos: 0,
                    Abonos_Marcados: 0,
                    Monto_Abonos: 0
                },
                this.formatoResumen
            )

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla, ["id"]).actualizaTabla()
        })
    }

    resumenAvance = () => {
        const datos = document.querySelectorAll("input[type=checkbox]:checked")
        const detalles = {
            Cargos_Marcados: 0,
            Monto_Cargos: 0,
            Abonos_Marcados: 0,
            Monto_Abonos: 0
        }
        const validacion = {}

        this.marcados = []
        Array.from(datos).forEach((dato) => {
            const fila = dato.closest("tr")
            this.marcados.push(this.datos.tabla.getFilaOriginal(fila.rowIndex - 1))
        })

        this.marcados.forEach((marcado) => {
            validacion[marcado.credito] = validacion[marcado.credito] || { abonos: 0, cargos: 0 }
            if (marcado.tipo == 1) {
                validacion[marcado.credito].cargos += parseFloat(marcado.monto)
                detalles.Cargos_Marcados++
                detalles.Monto_Cargos += parseFloat(marcado.monto)
            }
            if (marcado.tipo == 2) {
                validacion[marcado.credito].abonos += parseFloat(marcado.monto)
                detalles.Abonos_Marcados++
                detalles.Monto_Abonos += parseFloat(marcado.monto)
            }
        })

        this.datos.tabla.setDetalles(detalles, this.formatoResumen).mostrarDetalles()
        this.acciones.conciliar.habilitarBoton(
            Object.keys(validacion).length > 0 &&
                !Object.keys(validacion).some(
                    (val) => validacion[val].abonos != validacion[val].cargos
                )
        )
    }

    conciliaManual = () => {
        let msj = this.msjProcesando("Guardando transacciones...")
        const creditos = {}

        this.marcados.forEach((transaccion) => {
            creditos[transaccion.credito] = creditos[transaccion.credito] || {}
            creditos[transaccion.credito][transaccion.tipo] =
                creditos[transaccion.credito][transaccion.tipo] || []
            creditos[transaccion.credito][transaccion.tipo].push(transaccion)
        })

        const trnOK = []

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

                        trnOK.push(a)
                        trnOK.push(c)

                        cargo.resultado = "OK"
                        abono.resultado = "OK"
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
                        trnOK.push(a)
                        abono.resultado = "OK"

                        cargosTMP.forEach((c) => {
                            const crg = {}
                            crg.resultado = abono.id
                            crg.correspondencia = abono.origen
                            crg.origen = c.origen
                            crg.id = c.id

                            trnOK.push(crg)
                            c.resultado = "OK"
                        })
                        break
                    }
                }
            })
        })

        if (trnOK.length === 0)
            return (
                msj.ocultar(),
                this.msjAdvertencia("Las transacciones seleccionadas no son conciliables.")
            )

        this.modelo.guardar(trnOK).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(res.mensaje)

            this.msjExito("Registros actualizados correctamente.", (cerrar) => {
                this.buscar()
                if (cerrar) cerrar()
            })
        })
    }
}

export default ConNoConciliacionCtrl
