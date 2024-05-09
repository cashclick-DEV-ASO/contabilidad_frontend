import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegTrnDWHCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            "fecha inicio": this.formatoFecha,
            "fecha aprobacion": this.formatoFecha,
            "fecha vencimiento": this.formatoFecha,
            capital: this.formatoMoneda,
            interes: this.formatoMoneda,
            iva: this.formatoMoneda,
            total: this.formatoMoneda
        }
    }

    cambioArchivo = () => {
        this.acciones.guardar.habilitarBoton(false)
        this.datos.tabla.limpiar()
    }

    leerArchivo = async () => {
        const msj = this.msjProcesando("Leyendo archivo...")
        this.acciones.guardar.habilitarBoton(false)
        const lectura = await this.acciones.archivo.getArchivo().text()
        const datos = JSON.parse(lectura)

        if (!datos) {
            msj.ocultar()
            return this.msjError("El archivo no tiene el formato esperado.")
        }

        this.datos.tabla.parseaJSON(datos, null, this.formatoTabla).actualizaTabla()

        this.acciones.guardar.habilitarBoton(true)
        msj.ocultar()
    }

    guardar = async () => {
        this.msjContinuar(
            `Se guardará la información del archivo:<br><br>${this.acciones.archivo.ruta.name}<br><br>¿Desea continuar?`,
            {
                txtSi: "Si, guardar",
                txtNo: "No, cancelar",
                callbackSi: this.preparaDatos
            }
        )
    }

    preparaDatos = async (cerrar = null) => {
        let msj = this.msjProcesando("Guardando transacciones...")
        const lectura = await this.acciones.archivo.getArchivo().text()
        const dwh = JSON.parse(lectura)

        this.modelo.guardar(dwh).then((resultado) => {
            msj.ocultar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.msjExito("La información se guardó correctamente.")
            this.acciones.guardar.habilitarBoton(false)
            this.acciones.archivo.limpiar().habilitaSelector(true)
            this.datos.tabla.limpiar()

            if (cerrar) cerrar()
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

export default RegTrnDWHCtrl
