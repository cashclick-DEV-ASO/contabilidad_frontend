import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConSaldosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha: this.formatoFecha,
            saldo_inicial: this.formatoMoneda,
            saldo_final: this.formatoMoneda
        }
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => {
            this.acciones.banco.actulizaOpciones(this.bancos)
        })
    }

    cambiaFechaI = () => {
        if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
            this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())

        this.limpiaCampos({ cta: false, btn: false })
    }

    cambiaFechaF = () => {
        if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
            this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())

        this.limpiaCampos({ cta: false, btn: false })
    }

    cambioBanco = () => {
        this.limpiaCampos()

        this.banco = this.bancos.find(
            (banco) => banco.valor === Number(this.acciones.banco.getValorSeleccionado())
        )

        if (this.banco === undefined)
            return this.msjError("No se encontró información del banco seleccionado.")

        this.llenaListaCtasContables(this.banco.valor).then(() => {
            if (this.ctasContables.length === 0)
                return this.msjError("No hay cuentas registradas para el banco seleccionado.")

            this.acciones.cuenta.actulizaOpciones(this.ctasContables)
        })
    }

    cambioCuenta = () => {
        this.acciones.buscar.habilitarBoton(true)
    }

    limpiaCampos = ({ cta = true, btn = true } = {}) => {
        cta && this.acciones.cuenta.reinicia("")
        this.datos.tabla.limpiar()
        btn && this.acciones.buscar.habilitarBoton(false)
    }

    buscar = () => {
        const msj = this.msjProcesando("Consultando saldos...")
        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor(),
            cuenta: this.acciones.cuenta.getValorSeleccionado()
        }

        if (!this.verificarDatos(datos)) return

        this.modelo.consultaSaldoCuenta(datos).then((resultado) => {
            msj.ocultar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.datos.tabla.limpiar()
            if (resultado.datos.length === 0) {
                this.msjAdvertencia("No se encontraron saldos para los criterios seleccionados.")
                return
            }

            this.datos.tabla
                .parseaJSON(resultado.datos, null, this.formatoTabla, ["id"])
                .actualizaTabla()
        })
    }

    verificarDatos = (datos) => {
        const fechaMinima = new Date("2020-01-01")
        const fechaHoy = new Date()

        const fechaI = new Date(datos.fechaI)
        if (isNaN(fechaI.getTime())) {
            this.msjError("La fecha inicial no es válida.")
            return false
        }

        if (fechaI < fechaMinima) {
            this.msjError("La fecha inicial no puede ser menor a la del día actual.")
            return false
        }

        const fechaF = new Date(datos.fechaI)
        if (isNaN(fechaF.getTime())) {
            this.msjError("La fecha final no es válida.")
            return false
        }

        if (fechaF > fechaHoy) {
            this.msjError("La fecha final no puede ser mayor a la del día actual.")
            return false
        }

        return true
    }

    validaModificacion = (datos) => {
        return Object.keys(datos).some((dato) => {
            if (dato.toLowerCase() === "fecha") {
                const fecha = new Date(datos[dato])
                if (isNaN(fecha.getTime())) {
                    this.msjError("La fecha no es válida.")
                    return true
                }
                if (fecha < new Date("2020-01-01")) {
                    this.msjError("La fecha no puede ser menor al 01/01/2020.")
                    return true
                }
                if (fecha > new Date()) {
                    this.msjError("La fecha no puede ser mayor a la del día actual.")
                    return true
                }
            }
            if (dato.toLowerCase() === "saldo_inicial" || dato.toLowerCase() === "saldo_final") {
                if (datos[dato] < 1) {
                    this.msjError(`El campo ${dato} debe ser mayor a cero.`)
                    return true
                }
            }
            return false
        })
    }
}

export default ConSaldosCtrl
