import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConTrnDWHMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
        const filtros = []
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
                fecha_creacion,
                fecha_valor,
                cliente,
                credito,
                concepto,
                tipo,
                monto,
                capital,
                interes,
                iva_interes,
                penalizacion,
                iva_penalizacion
            FROM
                transaccion_dwh
            WHERE
                ${filtros.join(" AND ")}
            UNION ALL
            SELECT
                tv.id,
                tv.periodo,
                tv.fecha_registro,
                tv.fecha_valor,
                SUBSTRING_INDEX(tv.informacion, '||', 1),
                SUBSTRING_INDEX(tv.informacion, '||', -1),
                NULL,
                tv.tipo,
                tv.monto,
                0,
                0,
                0,
                0,
                0
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
        const informacion = datos.cliente + "||" + datos.credito

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
        const datosEnvio = {
            query: `UPDATE transaccion_dwh SET fecha_creacion=?, fecha_valor=?, cliente=?, credito=?, concepto=?, tipo=?, monto=?, capital=?, interes=?, iva_interes=?, penalizacion=?, iva_penalizacion=? WHERE id=?`,
            parametros: [
                this.fechaMySQL(datos.fecha_creacion),
                this.fechaMySQL(datos.fecha_valor),
                datos.cliente,
                datos.credito,
                datos.concepto,
                datos.tipo,
                datos.monto,
                datos.capital,
                datos.interes,
                datos.iva_interes,
                datos.penalizacion,
                datos.iva_penalizacion,
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM transaccion_dwh WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnDWHMdl
