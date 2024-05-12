import Modelo from "./modelo.js"

export class ConTrnMambuMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
        const filtros = ["visible = 1"]
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
                'Mambu' AS banco,
                fecha_creacion AS fecha_creación,
                fecha_valor,
                cliente,
                credito AS crédito,
                identificador_bancario,
                concepto,
                tipo,
                monto,
                informacion AS información
            FROM
                transaccion_mambu
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
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 4), '||', -1),
                tv.tipo,
                tv.monto,
                SUBSTRING_INDEX(SUBSTRING_INDEX(tv.informacion, '||', 5), '||', -1)
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
            datos.credito +
            "||" +
            datos.identificador_bancario +
            "||" +
            datos.concepto

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
        const datosEnvio = {}

        if (datos.banco != "0") {
            datosEnvio.query = `UPDATE transaccion_mambu
                    SET fecha_creacion=?, fecha_valor=?, cliente=?, credito=?, identificador_bancario=?, concepto=?, tipo=?, monto=?, informacion=?
                    WHERE id=?`
            datosEnvio.parametr = [
                this.fechaMySQL(datos.fecha_creación),
                this.fechaMySQL(datos.fecha_valor),
                datos.cliente,
                datos.cédito,
                datos.identificador_bancario,
                datos.concepto,
                datos.tipo,
                datos.monto,
                datos.información,
                datos.id
            ]
        } else {
            const informacion =
                datos.cliente +
                "||" +
                datos.cédito +
                "||" +
                datos.identificador_bancario +
                "||" +
                datos.concepto
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
            datosEnvio.query = "UPDATE transaccion_mambu SET visible = 0 WHERE id = ?"
            datosEnvio.parametros = [datos.id]
        } else {
            datosEnvio.query = "DELETE FROM transaccion_virtual WHERE id = ?"
            datosEnvio.parametros = [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnMambuMdl
