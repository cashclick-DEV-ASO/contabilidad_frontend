import Modelo from "./modelo.js"

export class RegAclaracionesMdl extends Modelo {
    constructor() {
        super()
    }

    async consultar(datos) {
        const datosConsulta = {
            query: `
            SELECT
                td.credito noCredito,
                td.cliente noCliente,
                td.capital capital,
                td.interes interes,
                DATE_FORMAT(td.fecha_valor, '%d/%m/%Y') fecha,
                DATE_FORMAT((
                    SELECT
                        MAX(tm.fecha_valor)
                    FROM
                        transaccion_mambu tm
                    WHERE
                        tm.credito = td.credito
                ), '%d/%m/%Y') ultimo_pago
            FROM
                transaccion_dwh td
            WHERE
                td.credito = ?
            `,
            parametros: [datos]
        }

        return await this.post("noConfig", datosConsulta)
    }

    async guardar(datos) {
        const datosGuardar = {
            query: `
            UPDATE
                transaccion_dwh
            SET
                notas = ?
            WHERE
                credito = ?
            `,
            parametros: [datos.nota, datos.credito]
        }

        return await this.post("noConfig", datosGuardar)
    }
}

export default RegAclaracionesMdl
