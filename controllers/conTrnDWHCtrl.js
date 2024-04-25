import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnDWHCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_creacion: this.formatoFecha,
            fecha_valor: this.formatoFecha,
            monto: this.formatoModena,
            capital: this.formatoModena,
            interes: this.formatoModena,
            iva_interes: this.formatoModena,
            penalizacion: this.formatoModena,
            iva_penalizacion: this.formatoModena,
            tipo: (dato) => {
                const tipos = ["No Identificado", "Cargo", "Abono"]
                return tipos[dato]
            }
        }
        this.opciones = [
            { valor: 1, texto: "Cargo" },
            { valor: 2, texto: "Abono" }
        ]
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

    cargaInicial = () => {
        this.acciones.tipo.setOpciones(this.opciones)
    }

    cambiaFechaI = () => {
        if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
            this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
    }

    cambiaFechaF = () => {
        if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
            this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
    }

    cambioTipo = async () => {
        this.datos.tabla.limpiar()

        this.opcion = this.opciones.find(
            (opcion) => opcion.valor === Number(this.acciones.tipo.getValorSeleccionado())
        )
    }

    buscar = () => {
        let msj = this.msjProcesando("Consultando transacciones...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor(),
            tipo: this.opcion
        }

        this.modelo.buscarTransaccionesDWH(datos).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(resultado.mensaje)

            if (res.datos.length === 0) {
                this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )
                return
            }

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
            if (
                dato.toLowerCase() === "monto" ||
                dato.toLowerCase() === "capital" ||
                dato.toLowerCase() === "interes" ||
                dato.toLowerCase() === "iva_interes"
            ) {
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

export default ConTrnDWHCtrl
