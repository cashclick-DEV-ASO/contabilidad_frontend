import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConTrnDWHMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
        const filtros = ["visible = 1"]
        const parametros = []
        const filtrosV = ["origen = 'DWH'"]
        const parametrosV = []

        if (datos.fechaI) {
            filtros.push("fecha_valor >= ?")
            parametros.push(datos.fechaI)
            filtrosV.push("fecha_valor >= ?")
            parametrosV.push(datos.fechaI)
        }

        if (datos.fechaF) {
            filtros.push("fecha_valor <= ?")
            parametros.push(datos.fechaF)
            filtrosV.push("fecha_valor <= ?")
            parametrosV.push(datos.fechaF)
        }

        if (datos.banco && datos.banco.valor !== SYS.DFLT) {
            filtros.push("id_banco = ?")
            parametros.push(datos.banco.valor)
            filtrosV.push("id = ?")
            parametrosV.push("0")
        }

        const datosEnvio = {
            query: `
            SELECT
                id,
                periodo,
                'DWH' AS banco,
                fecha_creacion AS fecha_creación,
                fecha_valor,
                cliente,
                credito AS crédito,
                concepto,
                tipo,
                monto,
                capital,
                interes AS interés,
                iva_interes AS iva_interés,
                penalizacion AS penalización,
                iva_penalizacion AS iva_penalización
            FROM
                transaccion_dwh
            WHERE
                ${filtros.join(" AND ")}
            UNION ALL
            SELECT
                tv.id,
                tv.periodo,
                'Virtual' AS banco,
                tv.fecha_registro,
                tv.fecha_valor,
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 1), '||', -1),
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 2), '||', -1),
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 3), '||', -1),
                tv.tipo,
                tv.monto,
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 4), '||', -1),
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 5), '||', -1),
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 6), '||', -1),
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 7), '||', -1),
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 8), '||', -1)
            FROM
                transaccion_virtual tv
            WHERE
                ${filtrosV.join(" AND ")}
                `,
            parametros: parametros.concat(parametrosV)
        }

        return await this.post("noConfig", datosEnvio)
    }

    async insertaTransaccion(datos) {
        const informacion =
            datos.cliente +
            "||" +
            datos.crédito +
            "||" +
            datos.concepto +
            "||" +
            datos.capital +
            "||" +
            datos.interés +
            "||" +
            datos.iva_interés +
            "||" +
            datos.penalización +
            "||" +
            datos.iva_penalización

        const datosEnvio = {
            query: "INSERT INTO transaccion_virtual (periodo, origen, tipo, monto, fecha_valor, informacion) VALUES (?, ?, ?, ?, ?, ?)",
            parametros: [
                datos.periodo,
                "DWH",
                datos.tipo,
                datos.monto,
                this.fechaMySQL(datos.fecha_valor),
                informacion
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async modificaTransaccion(datos) {
        const datosEnvio = {}

        if (datos.banco != "0") {
            datosEnvio.query = `UPDATE transaccion_dwh SET fecha_creacion=?, fecha_valor=?, cliente=?, credito=?, concepto=?, tipo=?, monto=?, capital=?, interes=?, iva_interes=?, penalizacion=?, iva_penalizacion=? WHERE id=?`
            datosEnvio.parametros = [
                this.fechaMySQL(datos.fecha_creación),
                this.fechaMySQL(datos.fecha_valor),
                datos.cliente,
                datos.crédito,
                datos.concepto,
                datos.tipo,
                datos.monto,
                datos.capital,
                datos.interés,
                datos.iva_interés,
                datos.penalización,
                datos.iva_penalización,
                datos.id
            ]
        } else {
            const informacion =
                datos.cliente +
                "||" +
                datos.crédito +
                "||" +
                datos.concepto +
                "||" +
                datos.capital +
                "||" +
                datos.interés +
                "||" +
                datos.iva_interés +
                "||" +
                datos.penalización +
                "||" +
                datos.iva_penalización

            datosEnvio.query = `UPDATE transaccion_virtual SET periodo = ?, tipo = ?, monto = ?, fecha_valor = ?, informacion = ? WHERE id = ?`
            datosEnvio.parametros = [
                datos.periodo,
                datos.tipo,
                datos.monto,
                this.fechaMySQL(datos.fecha_valor),
                informacion,
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {}

        if (datos.banco != "Virtual") {
            datosEnvio.query = "UPDATE transaccion_dwh SET visible = 0 WHERE id = ?"
            datosEnvio.parametros = [datos.id]
        } else {
            datosEnvio.query = "DELETE FROM transaccion_virtual WHERE id = ?"
            datosEnvio.parametros = [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnDWHMdl
