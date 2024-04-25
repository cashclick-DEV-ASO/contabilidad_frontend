import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegTrnMambuCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.contenido = null
        this.fechas = [
            "Fecha reporte",
            "Fecha de inicio del crédito",
            "Fecha vencimiento del préstamo",
            "Fecha programada de pago",
            "Fecha de pago"
        ]
        this.meses = {
            ene: "01",
            feb: "02",
            mar: "03",
            abr: "04",
            may: "05",
            jun: "06",
            jul: "07",
            ago: "08",
            sep: "09",
            oct: "10",
            nov: "11",
            dic: "12"
        }
        this.formatoTabla = {
            "Fecha reporte": this.formatoFecha,
            "Fecha de inicio del crédito": this.formatoFecha,
            "Fecha vencimiento del préstamo": this.formatoFecha,
            "Fecha programada de pago": this.formatoFecha,
            "Fecha de pago": this.formatoFecha,
            "Monto Crédito": this.formatoMoneda,
            "Importe Pago": this.formatoMoneda,
            "Capital pagado": this.formatoMoneda,
            "Interés pagado": this.formatoMoneda,
            "Iva interés pagado": this.formatoMoneda,
            "Interés moratorio pagado": this.formatoMoneda,
            "Iva interés moratorio pagado": this.formatoMoneda,
            "Crédito Castigado": this.formatoMoneda,
            "Cartera Vigente Total": this.formatoMoneda,
            "Cartera VencidaTotal": this.formatoMoneda
        }
    }

    cambioArchivo = () => {
        this.acciones.guardar.habilitarBoton(false)
        this.datos.tabla.limpiar()
    }

    leerArchivo = async () => {
        let msj = this.msjProcesando("Leyendo archivo...")
        this.acciones.guardar.habilitarBoton(false)
        this.datos.tabla.limpiar()

        const archivo = await this.acciones.archivo.getArchivo()

        let reader = new FileReader()
        reader.onload = (e) => {
            let data = new Uint8Array(e.target.result)
            let libro = XLSX.read(data, { type: "array", codepage: 65001 })
            let hoja = XLSX.utils.sheet_to_json(libro.Sheets["InformacionGeneral"], { header: 1 })
            let titulos = hoja[1]
            let transacciones = []

            hoja.forEach((fila, i) => {
                if (i <= 1 || fila[0] === "") return
                let filaTmp = {}
                titulos.forEach((key, j) => {
                    let d = fila[j]
                    if (this.fechas.includes(key)) d = this.numeroMes(d)

                    filaTmp[key] = d
                })
                transacciones.push(filaTmp)
            })

            if (transacciones.length === 0) {
                msj.ocultar()
                return this.msjError("El archivo no tiene el formato esperado.")
            }

            this.contenido = transacciones
            this.datos.tabla.parseaJSON(transacciones, null, this.formatoTabla).actualizaTabla()
            this.acciones.guardar.habilitarBoton(true)
            msj.ocultar()
        }

        reader.readAsArrayBuffer(archivo)
    }

    numeroMes = (fecha) => {
        if (fecha === "") return fecha
        let f = fecha.split("-")
        f[1] = this.meses[f[1]]
        return new Date(f[2], parseInt(f[1]) - 1, f[0])
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
        let periodo = this.acciones.selPeriodo.getPeriodo()
        let p = `${periodo.anio}${periodo.mes}`

        this.modelo.guardar(this.contenido, p).then((resultado) => {
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

export default RegTrnMambuCtrl
