import Modelo from "./modelo.js"

import { mostrarError } from "../src/utils.js"
import { anchoBBVA, delimitadoCONEKTA, excelSTP } from "../src/layoutParser.js"

export class RegTrnBancosMdl extends Modelo {
    constructor() {
        super()
    }

    async leerArchivo(archivo, xls = false) {
        if (!archivo) {
            this.mensaje = "No se ha seleccionado un archivo."
            return null
        }

        try {
            if (xls) {
                return new Promise((resolve, reject) => {
                    const lector = new FileReader()

                    lector.onload = (e) => {
                        const datos = new Uint8Array(e.target.result)
                        const libro = XLSX.read(datos, { type: "array" })

                        const nombreHoja = libro.SheetNames[0]
                        const hoja = libro.Sheets[nombreHoja]

                        resolve(hoja)
                    }

                    lector.onerror = (error) => reject(error)

                    lector.readAsArrayBuffer(archivo)
                })
            }
            return await archivo.text()
        } catch (error) {
            mostrarError(error)
            this.mensaje = "Ocurrió un problema al leer el archivo."
            return null
        }
    }

    async aplicaLayout(banco, lyt, contenidoArchivo) {
        this.resultado = null

        if (!contenidoArchivo) {
            this.mensaje = "No se ha proporcionado un archivo."
            return false
        }

        if (!lyt) {
            this.mensaje = "No se ha encontrado el layout."
            return false
        }

        const { tipo, layout } = lyt

        let r = { success: false }
        if (banco.texto === "BBVA" && tipo === "fijo")
            r = anchoBBVA(contenidoArchivo, JSON.parse(layout))
        if (banco.texto === "Conekta" && tipo === "delimitado")
            r = delimitadoCONEKTA(contenidoArchivo, JSON.parse(layout))
        if (banco.texto === "STP" && tipo === "excel")
            r = excelSTP(contenidoArchivo, JSON.parse(layout))

        if (r.success) {
            this.mensaje = r.mensaje

            this.resultado = {
                success: r.success,
                informacion: r.informacion,
                movimientos: r.movimientos
            }
            return this.resultado.success
        }

        this.mensaje =
            r.mensaje ||
            "No se cuenta con la configuración necesaria para ese layout.\nFavor de notificar al administrador."
        return false
    }

    async guardar(edoCta) {
        const validacion = {
            query: "SELECT * FROM edo_cta WHERE periodo = ? AND archivo = ?",
            parametros: [edoCta.periodo, edoCta.archivo]
        }

        const existe = await this.post("noConfig", validacion)

        if (existe.success && existe.datos.length > 0)
            return {
                success: false,
                mensaje: `El archivo ${edoCta.archivo} ya ha sido cargado para el periodo ${edoCta.periodo}.`
            }

        const datID = {
            query: "INSERT INTO edo_cta (periodo, archivo, fecha_captura, id_cuenta, id_banco, id_layout) VALUES (?, ?, ?, ?, ?, ?)",
            parametros: [
                edoCta.periodo,
                edoCta.archivo,
                edoCta.fecha_carga,
                edoCta.id_cuenta,
                edoCta.id_banco,
                edoCta.id_layout
            ]
        }

        const id_edo_cta = await this.post("noConfig", datID)

        if (!id_edo_cta.success)
            return {
                success: false,
                mensaje: "Error al guardar el estado de cuenta."
            }

        const id_edo = id_edo_cta.datos[0].insertId
        const trnsToSend = edoCta.trns.map((trn) => {
            return [
                id_edo,
                trn.linea,
                trn.informacion,
                this.txtToFechaMysql(trn.fecha_creacion),
                this.txtToFechaMysql(trn.fecha_valor),
                trn.concepto,
                trn.tipo,
                this.monedaToFloat(trn.monto)
            ]
        })

        const datos = {
            query: "INSERT INTO transaccion_banco (id_edo_cta, linea, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto) VALUES ?",
            parametros: [trnsToSend]
        }

        return await this.post("noConfig", datos)
    }

    valida(banco, periodo, archivo, layout, contenidoArchivo = this.contenidoArchivo) {
        if (banco === "") return (this.mensaje = "No se ha seleccionado un banco.")
        else if (periodo === "") return (this.mensaje = "No se ha seleccionado un periodo.")
        else if (archivo === "") return (this.mensaje = "No se ha seleccionado un archivo.")
        else if (layout === "") return (this.mensaje = "No se ha seleccionado un layout.")
        else if (!contenidoArchivo) return (this.mensaje = "No se ha proporcionado un archivo.")
        else return true
    }

    txtToFechaMysql(fecha) {
        if (!fecha) return null
        const [dia, mes, anio] = fecha.split("/")
        return `${anio}-${mes}-${dia}`
    }

    monedaToFloat(monto) {
        return parseFloat(monto.replace(/[$,]/gi, ""))
    }
}

export default RegTrnBancosMdl
