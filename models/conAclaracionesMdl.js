import Modelo from "./modelo.js"

export class ConAclaracionesMdl extends Modelo {
    constructor() {
        super()
    }

    async buscar() {
        const datos = {
            query: `
            SELECT
                td.credito,
                td.cliente,
                td.fecha_valor,
                td.concepto,
                td.notas
            FROM
                transaccion_dwh td
            WHERE
                td.notas IS NOT NULL
            `,
            parametros: []
        }

        return await this.post("noConfig", datos)
    }
}

export default ConAclaracionesMdl
