import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConTrnDWHMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransaccionesDWH(datos) {
        const filtros = []
        const parametros = []

        if (datos.fechaI) {
            filtros.push("fecha_creacion >= ?")
            parametros.push(datos.fechaI)
        }

        if (datos.fechaF) {
            filtros.push("fecha_creacion <= ?")
            parametros.push(datos.fechaF)
        }

        if (datos.tipo && datos.tipo.valor !== SYS.DFLT) {
            filtros.push("tipo = ?")
            parametros.push(datos.tipo.valor)
        }

        const datosEnvio = {
            query: `SELECT id, periodo, fecha_creacion, fecha_valor, cliente, credito, concepto, tipo, monto, capital, interes, iva_interes, penalizacion, iva_penalizacion FROM transaccion_dwh WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
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
