import Modelo from "./modelo.js"

export class ConTrnVirtualMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
        const filtros = []
        const parametros = []

        if (datos.fechaI) {
            filtros.push("fecha_valor >= ?")
            parametros.push(datos.fechaI)
        }

        if (datos.fechaF) {
            filtros.push("fecha_valor <= ?")
            parametros.push(datos.fechaF)
        }

        const datosEnvio = {
            query: `
            SELECT
                tv.id,
                tv.periodo,
                tv.origen,
                tv.informacion,
                tv.tipo,
                tv.monto,
                tv.fecha_registro,
                tv.fecha_valor
            FROM
                transaccion_virtual tv
            WHERE
                ${filtros.join(" AND ")}
            `,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }

    async modificaTransaccion(datos) {
        const datosEnvio = {
            query: `UPDATE transaccion_virtual
                    SET periodo=?, origen=?, informacion=?, tipo=?, monto=?, fecha_registro=?, fecha_valor=?
                    WHERE id=?;`,
            parametros: [
                datos.periodo,
                datos.origen,
                datos.informacion,
                datos.tipo,
                datos.monto,
                this.fechaMySQL(datos.fecha_registro),
                this.fechaMySQL(datos.fecha_valor),
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM transaccion_virtual WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnVirtualMdl
