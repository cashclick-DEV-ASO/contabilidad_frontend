import Modelo from "./modelo.js"

export class ConTrnMambuMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransaccionesMambu(datos) {
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

        const datosEnvio = {
            query: `SELECT id, periodo, fecha_creacion, fecha_valor, cliente, credito, identificador_bancario, concepto, tipo, monto, informacion FROM transaccion_mambu WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
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
