import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

export class RegSaldosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.saldoAnterior = undefined
        this.saldoSiguiente = undefined
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => {
            this.acciones.banco.actulizaOpciones(this.bancos)
        })
    }

    cambioBanco = async () => {
        this.limpiaCampos({ bnk: false })
        this.acciones.cuenta.actulizaOpciones().setTemporalPH("Cargando layout...").mostrar()

        this.banco = this.bancos.find(
            (banco) => banco.valor === Number(this.acciones.banco.getValorSeleccionado())
        )

        if (this.banco === undefined)
            return this.msjError("No se encontró información del banco seleccionado.")

        this.llenaListaCtasContables(this.banco.valor).then(() => {
            if (this.ctasContables.length === 0)
                return this.msjError("No hay cuentas registradas para el banco seleccionado.")

            this.acciones.cuenta.actulizaOpciones(this.ctasContables)
            this.acciones.guardar.habilitarBoton(false)
        })
    }

    cambioCuenta = async () => {
        this.cuenta = this.ctasContables.find(
            (cuenta) => cuenta.valor === Number(this.acciones.cuenta.getValorSeleccionado())
        )

        if (this.cuenta === undefined)
            return this.msjError("No se encontró información de la cuenta.")

        this.limpiaCampos({ cta: false, bnk: false })
        this.acciones.guardar.habilitarBoton(false)

        this.saldos()
    }

    limpiaCampos = ({ cta = true, bnk = true } = {}) => {
        bnk && this.acciones.banco.reinicia("")
        cta && this.acciones.cuenta.actulizaOpciones([])
        // this.acciones.fecha.reinicia("")
        this.acciones.inicial.setValor("")
        this.acciones.final.setValor("")
        this.saldoAnterior = undefined
        this.saldoSiguiente = undefined
    }

    cambioFecha = () => this.saldos()

    saldos = () => {
        if (this.acciones.fecha.getValor() === "") return
        if (this.acciones.cuenta.getValorSeleccionado() === "") return

        this.acciones.inicial.setValor("")
        this.acciones.final.setValor("")

        this.modelo
            .saldosRegistrados(
                this.acciones.cuenta.getValorSeleccionado(),
                this.acciones.fecha.getValor()
            )
            .then((resultado) => {
                if (!resultado.success || resultado.datos.length === 0) {
                    this.saldoAnterior = undefined
                    this.saldoSiguiente = undefined
                    return this.validaModificacion()
                }

                this.saldoAnterior =
                    resultado.datos[0].saldo_inicial === "ND"
                        ? undefined
                        : resultado.datos[0].saldo_inicial
                this.saldoSiguiente =
                    resultado.datos[0].saldo_final === "ND"
                        ? undefined
                        : resultado.datos[0].saldo_final

                if (this.saldoAnterior)
                    this.acciones.inicial.setValor(this.formatoMoneda(this.saldoAnterior))
                if (this.saldoSiguiente)
                    this.acciones.final.setValor(this.formatoMoneda(this.saldoSiguiente))
                this.validaModificacion()
            })
    }

    validaModificacion = () => {
        this.acciones.guardar.habilitarBoton(false)

        if (this.acciones.fecha.getValor() === "") return false
        if (this.acciones.inicial.getValor() === "") return false
        if (this.acciones.final.getValor() === "") return false
        if (this.acciones.banco.dfltSelecciondo()) return false
        if (this.acciones.cuenta.dfltSelecciondo()) return false

        this.acciones.guardar.habilitarBoton(true)
        return true
    }

    verificarDatos = async () => {
        if (!this.validaModificacion()) return
        let confirmacion = false

        if (
            this.saldoAnterior !== undefined &&
            this.saldoAnterior !== "ND" &&
            this.acciones.inicial.getValor() !== this.saldoAnterior
        )
            confirmacion =
                "El saldo inicial capturado no coincide con el saldo final del día anterior registrado."

        if (
            this.saldoSiguiente !== undefined &&
            this.saldoSiguiente !== "ND" &&
            this.acciones.final.getValor() !== this.saldoSiguiente
        )
            confirmacion =
                "El saldo final capturado no coincide con el saldo inicial del día siguiente registrado."

        if (confirmacion) {
            this.msjContinuar(
                confirmacion +
                    "<br>Se recomienda validar la información antes de continuar.<br><br>¿Desea continuar en este momento?",
                {
                    txtSi: "Si, continuar",
                    txtNo: "No",
                    callbackSi: this.guardar
                }
            )
            return
        }

        this.guardar()
    }

    guardar = (cerrar = null) => {
        const sldo = {
            idCtaContable: this.acciones.cuenta.getValorSeleccionado(),
            fecha: this.formatoFecha(this.acciones.fecha.getValor()),
            saldoI: this.monedaANumero(this.acciones.inicial.getValor()),
            saldoF: this.monedaANumero(this.acciones.final.getValor())
        }

        if (cerrar) cerrar()
        let msj = this.msjProcesando("Guardando saldo...")
        this.modelo.registraSaldo(sldo).then((resultado) => {
            msj.ocultar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.msjExito("Saldo registrado correctamente.")
            this.limpiaCampos()
            this.acciones.guardar.habilitarBoton(false)
        })
    }

    monedaANumero(valor) {
        const valorNumerico = valor.replace(/[^\d.]/g, "")
        const numero = parseFloat(valorNumerico)

        return isNaN(numero) ? null : numero
    }

    formatoFecha = (fecha) => {
        const d = new Date(fecha)
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    }
}

export default RegSaldosCtrl
