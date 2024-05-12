import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

export class ConTrnMambuCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_creación: this.formatoFecha,
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: (dato) => {
                const tipos = ["No Identificado", "Cargo", "Abono"]
                return tipos[dato]
            }
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
        let msj = this.msjProcesando("Consultando transacciones...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor()
        }

        this.modelo.buscarTransacciones(datos).then((res) => {
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
            if (dato.toLowerCase() === "periodo") {
                if (isNaN(datos[dato])) {
                    this.msjError(`El campo periodo debe ser numérico.`)
                    return true
                }
                if (datos[dato].toString().length !== 6) {
                    this.msjError(`El campo periodo debe tener 6 caracteres numéricos (AAAAMM).`)
                    return true
                }
                if (datos[dato].toString().substring(4) > 12) {
                    this.msjError(`El campo periodo debe tener un mes válido.`)
                    return true
                }
            }
            if (dato.toLowerCase() === "fecha_creación" || dato.toLowerCase() === "fecha_valor") {
                const fecha = new Date(datos[dato])
                if (isNaN(fecha.getTime())) {
                    this.msjError(`El campo ${dato.replace("_", " ")} no es una fecha válida.`)
                    return true
                }
                if (fecha < new Date("2020-01-01")) {
                    this.msjError(
                        `El campo ${dato.replace("_", " ")} no puede ser menor a 01/01/2024.`
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
            if (dato.toLowerCase() === "monto") {
                if (datos[dato] < 1) {
                    this.msjError(`El campo ${dato.replace("_", " ")} debe ser mayor a cero.`)
                    return true
                }
            }
            if (dato.toLowerCase() === "cliente") {
                if (datos[dato] === "") {
                    this.msjError(`El campo ${dato.replace("_", " ")} no puede estar vacío.`)
                    return true
                }
            }
            if (dato.toLowerCase() === "crédito") {
                if (datos[dato] === "") {
                    this.msjError(`El campo ${dato.replace("_", " ")} no puede estar vacío.`)
                    return true
                }
                if (datos[dato].length !== 9) {
                    this.msjError(`El campo ${dato.replace("_", " ")} debe tener 9 caracteres.`)
                    return true
                }
                if (datos[dato].substring(0, 3) !== "100") {
                    this.msjError(`El campo ${dato.replace("_", " ")} debe comenzar con 100.`)
                    return true
                }
            }
            if (dato.toLowerCase() === "tipo") {
                if (datos[dato] === SYS.DFLT) {
                    this.msjError(
                        `El campo Tipo Movimiento no es válido, se debe seleccionar una opción.`
                    )
                    return true
                }
            }
        })
    }
}

export default ConTrnMambuCtrl
