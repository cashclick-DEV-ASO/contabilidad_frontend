import Modelo from "./modelo.js"

export class ResConciliacionMdl extends Modelo {
    constructor() {
        super()
    }

    async consultarBancos(datos) {
        const filtros = []
        const parametros = []

        if (datos.periodoI) {
            filtros.push("periodo >= ?")
            parametros.push(datos.periodoI)
        }

        if (datos.periodoF) {
            filtros.push("periodo <= ?")
            parametros.push(datos.periodoF)
        }

        const datosResumen = {
            query: `
            SELECT
                COUNT(*) AS noTrn,
                SUM(monto) AS montoTrn,
                COUNT(CASE WHEN resultado > 0 THEN 1 ELSE NULL END) AS noTrnOK,
                COUNT(CASE WHEN resultado = 0 THEN 1 ELSE NULL END) AS noTrnNoOK,
                SUM(CASE WHEN resultado > 0 THEN monto ELSE 0 END) AS montoTrnOK,
                SUM(CASE WHEN resultado = 0 THEN monto ELSE 0 END) AS montoTrnNoOK
            FROM
                transaccion_banco tb
            RIGHT JOIN
                edo_cta ec ON tb.id_edo_cta = ec.id
            WHERE
                ${filtros.join(" AND ")}
                AND tb.visible = 1
                AND (
                        (ec.id_banco = 1 AND tb.credito LIKE '1%')
                        OR (ec.id_banco = 2 AND tb.fecha_valor IS NOT NULL)
                        OR (ec.id_banco = 3)
                    )
            GROUP BY
                periodo
            `,
            parametros: [...parametros]
        }

        return await this.post("noConfig", datosResumen)
    }

    async consultarDWH(datos) {
        const filtros = []
        const parametros = []

        if (datos.periodoI) {
            filtros.push("periodo >= ?")
            parametros.push(datos.periodoI)
        }

        if (datos.periodoF) {
            filtros.push("periodo <= ?")
            parametros.push(datos.periodoF)
        }

        const datosResumen = {
            query: `
            SELECT
                COUNT(*) AS noTrn,
                SUM(monto) AS montoTrn,
                COUNT(CASE WHEN resultado > 0 THEN 1 ELSE NULL END) AS noTrnOK,
                COUNT(CASE WHEN resultado = 0 THEN 1 ELSE NULL END) AS noTrnNoOK,
                SUM(CASE WHEN resultado > 0 THEN monto ELSE 0 END) AS montoTrnOK,
                SUM(CASE WHEN resultado = 0 THEN monto ELSE 0 END) AS montoTrnNoOK
            FROM
                transaccion_dwh td
            WHERE
                ${filtros.join(" AND ")}
                AND td.visible = 1
            GROUP BY
                periodo
            `,
            parametros: [...parametros]
        }

        return await this.post("noConfig", datosResumen)
    }

    async consultarMambu(datos) {
        const filtros = []
        const parametros = []

        if (datos.periodoI) {
            filtros.push("periodo >= ?")
            parametros.push(datos.periodoI)
        }

        if (datos.periodoF) {
            filtros.push("periodo <= ?")
            parametros.push(datos.periodoF)
        }

        const datosResumen = {
            query: `
            SELECT
                COUNT(*) AS noTrn,
                SUM(monto) AS montoTrn,
                COUNT(CASE WHEN resultado > 0 THEN 1 ELSE NULL END) AS noTrnOK,
                COUNT(CASE WHEN resultado = 0 THEN 1 ELSE NULL END) AS noTrnNoOK,
                SUM(CASE WHEN resultado > 0 THEN monto ELSE 0 END) AS montoTrnOK,
                SUM(CASE WHEN resultado = 0 THEN monto ELSE 0 END) AS montoTrnNoOK
            FROM
                transaccion_mambu tm
            WHERE
                ${filtros.join(" AND ")}
                AND tm.visible = 1
            GROUP BY
                periodo
            `,
            parametros: [...parametros]
        }

        return await this.post("noConfig", datosResumen)
    }
}

export default ResConciliacionMdl
