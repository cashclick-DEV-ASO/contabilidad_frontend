import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegSaldosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => {
            this.acciones.banco.actulizaOpciones(this.bancos)
        })
    }

    cambioBanco = async () => {
        this.limpiaCampos()
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

        this.limpiaCampos({ cta: false })
        this.acciones.guardar.habilitarBoton(false)
    }

    limpiaCampos = ({ cta = true } = {}) => {
        cta && this.acciones.cuenta.reinicia("")
        this.acciones.fecha.reinicia("")
        this.acciones.inicial.setValor("")
        this.acciones.final.setValor("")
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
        if (!this.validaModificacion()) return false

        const fecha = new Date(this.acciones.fecha.getValor())
        const fechaHoy = new Date()
        if (fecha > fechaHoy) {
            this.msjError("La fecha no puede ser mayor a la fecha actual.")
            return false
        }

        const sldo = {
            idCtaContable: this.acciones.cuenta.getValorSeleccionado(),
            fecha: this.formatoFecha(this.acciones.fecha.getValor()),
            saldoI: this.monedaANumero(this.acciones.inicial.getValor()),
            saldoF: this.monedaANumero(this.acciones.final.getValor())
        }

        let msj = this.msjProcesando("Guardando saldo...")
        this.modelo.registraSaldo(sldo).then((resultado) => {
            msj.ocultar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.msjExito("Saldo registrado correctamente.")
            this.limpiaCampos()
            this.acciones.guardar.habilitarBoton(false)
        })
    }

    formatoNumero = (n) => {
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    formatoMoneda = (input, blur = false) => {
        var input_val = input.value
        if (input_val === "") return
        const original_len = input_val.length
        let caret_pos = input.selectionStart
        if (input_val.indexOf(".") >= 0) {
            const decimal_pos = input_val.indexOf(".")
            let left_side = input_val.substring(0, decimal_pos)
            let right_side = input_val.substring(decimal_pos)
            left_side = this.formatoNumero(left_side)
            right_side = this.formatoNumero(right_side)
            if (blur) right_side += "00"
            right_side = right_side.substring(0, 2)
            input_val = "$" + left_side + "." + right_side
        } else {
            input_val = this.formatoNumero(input_val)
            input_val = "$" + input_val
            if (blur) input_val += ".00"
        }
        input.value = input_val
        var updated_len = input_val.length
        caret_pos = updated_len - original_len + caret_pos
        input.setSelectionRange(caret_pos, caret_pos)
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
