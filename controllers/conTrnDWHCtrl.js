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
            monto: this.formatoMoneda,
            capital: this.formatoMoneda,
            interes: this.formatoMoneda,
            iva_interes: this.formatoMoneda,
            penalizacion: this.formatoMoneda,
            iva_penalizacion: this.formatoMoneda,
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

    cargaInicial = () => this.acciones.tipo.setOpciones(this.opciones)

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
            if (
                dato.toLowerCase() === "fecha_inicio" ||
                dato.toLowerCase() === "fecha_aprobacion"
            ) {
                const fecha = new Date(datos[dato])
                if (isNaN(fecha.getTime())) {
                    this.msjError(`El campo ${dato.replace("_", " ")} no es una fecha válida.`)
                    return true
                }
                if (fecha < new Date("2020-01-01")) {
                    this.msjError(
                        `El campo ${dato.replace("_", " ")} no puede ser menor a la fecha mínima.`
                    )
                    return true
                }
                if (fecha > new Date()) {
                    this.msjError(
                        `El campo ${dato.replace("_", " ")} no puede ser mayor a la fecha actual.`
                    )
                    return true
                }
            }
            if (
                dato.toLowerCase() === "capital" ||
                dato.toLowerCase() === "interes" ||
                dato.toLowerCase() === "iva" ||
                dato.toLowerCase() === "total"
            ) {
                if (datos[dato] < 1) {
                    this.msjError(`El campo ${dato.replace("_", " ")} debe ser mayor a cero.`)
                    return true
                }
            }
            if (
                dato.toLowerCase() === "id_cliente" ||
                dato.toLowerCase() === "nombre" ||
                dato.toLowerCase() === "rfc" ||
                dato.toLowerCase() === "curp" ||
                dato.toLowerCase() === "credito" ||
                dato.toLowerCase() === "movimiento"
            ) {
                if (datos[dato] === "") {
                    this.msjError(`El campo ${dato.replace("_", " ")} no puede estar vacío.`)
                    return true
                }
            }
        })
    }
}

export default ConTrnDWHCtrl
