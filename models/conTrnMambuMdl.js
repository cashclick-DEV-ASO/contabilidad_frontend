import Modelo from "./modelo.js"

export class ConTrnMambuMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
        const filtros = []
        const parametros = []
        const filtrosV = ["origen = 'Mambu'"]
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

        const datosEnvio = {
            query: `
            SELECT
                id,
                periodo,
                fecha_creacion,
                fecha_valor,
                cliente,
                credito,
                identificador_bancario,
                concepto,
                tipo,
                monto,
                informacion
            FROM
                transaccion_mambu
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
                NULL,
                tv.tipo,
                tv.monto,
                NULL
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
                "Mambu",
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
            query: `UPDATE transaccion_mambu
                    SET fecha_creacion=?, fecha_valor=?, cliente=?, credito=?, identificador_bancario=?, concepto=?, tipo=?, monto=?, informacion=?
                    WHERE id=?;`,
            parametros: [
                this.fechaMySQL(datos.fecha_creacion),
                this.fechaMySQL(datos.fecha_valor),
                datos.cliente,
                datos.credito,
                datos.identificador_bancario,
                datos.concepto,
                datos.tipo,
                datos.monto,
                datos.informacion,
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM transaccion_mambu WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnMambuMdl
