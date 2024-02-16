import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConSaldosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha: (dato) => {
                return new Date(dato).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            },
            saldo_inicial: (dato) => {
                const numero = parseFloat(dato)
                if (isNaN(numero)) return dato

                return numero.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN"
                })
            },
            saldo_final: (dato) => {
                const numero = parseFloat(dato)
                if (isNaN(numero)) return dato

                return numero.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN"
                })
            }
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

            this.datos.tabla.parseaJSON(resultado.datos, null, this.formatoTabla).actualizaTabla()
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
}

export default ConSaldosCtrl
