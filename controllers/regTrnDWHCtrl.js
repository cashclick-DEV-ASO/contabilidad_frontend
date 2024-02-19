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

    formatoFecha = (dato) => {
        return new Date(dato).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    formatoMoneda = (dato) => {
        const numero = parseFloat(dato)
        if (isNaN(numero)) return dato

        return numero.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        })
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

        if (!datos.datos) {
            msj.ocultar()
            return this.msjError("El archivo no tiene el formato esperado.")
        }

        this.datos.tabla.parseaJSON(datos.datos, null, this.formatoTabla).actualizaTabla()

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

        this.modelo.guardar(dwh.datos).then((resultado) => {
            msj.ocultar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.msjExito("La información se guardó correctamente.")
            this.acciones.guardar.habilitarBoton(false)
            this.acciones.archivo.limpiar().habilitaSelector(true)
            this.datos.tabla.limpiar()

            if (cerrar) cerrar()
        })
    }
}

export default RegTrnDWHCtrl
