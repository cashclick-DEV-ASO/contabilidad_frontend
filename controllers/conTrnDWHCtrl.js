import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnDWHCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_creación: this.formatoFecha,
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            capital: this.formatoMoneda,
            interés: this.formatoMoneda,
            iva_interés: this.formatoMoneda,
            penalización: this.formatoMoneda,
            iva_penalización: this.formatoMoneda,
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

        this.modelo.buscar(datos).then((res) => {
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

    sumarMonto = (e) => {
        let monto = 0
        document.querySelectorAll(".suma").forEach((campo) => {
            const valor = parseFloat(campo.value.replace(/[^\d.]/g, "")) || 0
            monto += valor
            if (e.target === campo && (campo.id === "int" || campo.id === "pen")) {
                document.querySelector(`#iva_${campo.id}`).value = valor * 0.16
                document.querySelector(`#iva_${campo.id}`).dispatchEvent(new Event("blur"))
            }
        })
        document.querySelector(".total").value = monto
        document.querySelector(".total").dispatchEvent(new Event("blur"))
    }

    validaModificacion = (datos) => {
        const s =
            (parseFloat(datos["capital"]) || 0) +
            (parseFloat(datos["interés"]) || 0) +
            (parseFloat(datos["iva_interés"]) || 0) +
            (parseFloat(datos["penalización"]) || 0) +
            (parseFloat(datos["iva_penalización"]) || 0)

        const t = parseFloat(datos["monto"]) || 0
        if (s !== t) {
            this.msjError(
                `La suma de los campos Capital, Interés, IVA Interés, Penalización e IVA Penalización debe ser igual al campo Monto.`
            )
            return true
        }

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
                if (
                    datos[dato].toString().substring(4) > 12 ||
                    datos[dato].toString().substring(4) < 1
                ) {
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
                dato.toLowerCase() === "monto" ||
                dato.toLowerCase() === "capital" ||
                dato.toLowerCase() === "interés" ||
                dato.toLowerCase() === "iva_interés"
            ) {
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
                if (datos[dato].toString().length !== 9) {
                    this.msjError(`El campo ${dato.replace("_", " ")} debe tener 9 caracteres.`)
                    return true
                }
                if (datos[dato].toString().substring(0, 3) !== "100") {
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

export default ConTrnDWHCtrl
