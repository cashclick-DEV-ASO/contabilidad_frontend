import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnBancosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_valor: this.formatoFecha,
            fecha_creacion: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: this.tipoMovimiento
        }
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => this.acciones.banco.actulizaOpciones(this.bancos))
    }

    cambiaFechaI = () => {
        if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
            this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
    }

    cambiaFechaF = () => {
        if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
            this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
    }

    cambioBanco = async () => {
        this.datos.tabla.limpiar()

        this.banco = this.bancos.find(
            (banco) => banco.valor === Number(this.acciones.banco.getValorSeleccionado())
        )

        this.acciones.buscar.habilitarBoton(true)
    }

    buscar = () => {
        let msj = this.msjProcesando("Consultando transacciones...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor(),
            banco: this.banco
        }

        this.modelo.buscarTransaccionesBancos(datos).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(resultado.mensaje)
            if (res.datos.length === 0)
                return this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla, ["id"]).actualizaTabla()
        })
    }

    validaModificacion = (datos) => {
        return Object.keys(datos).some((dato) => {
            if (dato.toLowerCase() === "fecha_creacion" || dato.toLowerCase() === "fecha_valor") {
                const fecha = new Date(datos[dato])
                if (isNaN(fecha.getTime())) {
                    this.msjError("La fecha no es válida.")
                    return true
                }
                if (fecha < new Date("2020-01-01")) {
                    this.msjError(`El campo ${dato} no puede ser menor a la fecha mínima.`)
                    return true
                }
                if (fecha > new Date()) {
                    this.msjError(`El campo ${dato} no puede ser mayor a la fecha actual.`)
                    return true
                }
            }
            if (dato.toLowerCase() === "monto") {
                if (datos[dato] < 1) {
                    this.msjError(`El campo ${dato} debe ser mayor a cero.`)
                    return true
                }
            }
            if (dato.toLowerCase() === "tipo") {
                if (datos[dato] != 1 && datos[dato] != 2) {
                    this.msjError(`El campo ${dato} no es válido, debe ser 1 (cargo) o 2 (abono).`)
                    return true
                }
            }
            return false
        })
    }
}

export default ConTrnBancosCtrl
