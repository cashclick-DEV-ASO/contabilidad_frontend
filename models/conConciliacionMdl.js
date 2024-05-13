import Modelo from "./modelo.js"

export class ConConciliacionMdl extends Modelo {
    constructor() {
        super()
    }

    async buscar(datos) {
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

        const datosConciliacion = {
            query: `
            SELECT
                *
            FROM (
                SELECT
                    tb.id,
                    (SELECT b.nombre FROM banco b WHERE b.id = ec.id_banco) AS origen,
                    CASE ec.id_banco
                        WHEN 2 THEN (SELECT credito FROM transaccion_mambu WHERE tb.credito LIKE CONCAT(identificador_bancario, '%') LIMIT 1)
                        WHEN 3 THEN (SELECT credito FROM transaccion_mambu WHERE tb.concepto LIKE CONCAT(identificador_bancario, '%') AND tb.monto = monto LIMIT 1)
                        ELSE tb.credito
                    END AS credito,
                    tb.fecha_valor,
                    tb.tipo,
                    tb.monto,
                    tb.correspondencia,
                    tb.resultado
                FROM
                    transaccion_banco tb
                RIGHT JOIN
                    edo_cta ec ON tb.id_edo_cta = ec.id
                WHERE
                    ${filtros.join(" AND ")}
                    AND tb.resultado > 0
                    AND tb.visible = 1
                    AND (
                            (ec.id_banco = 1 AND tb.credito LIKE '1%')
                            OR (ec.id_banco = 2 AND tb.fecha_valor IS NOT NULL)
                            OR (ec.id_banco = 3)
                        )
                UNION ALL
                SELECT
                    td.id,
                    'DWH' as origen,
                    td.credito,
                    td.fecha_valor,
                    td.tipo,
                    td.monto,
                    td.correspondencia,
                    td.resultado
                FROM
                    transaccion_dwh td
                WHERE
                    ${filtros.join(" AND ")}
                    AND td.resultado > 0
                    AND td.visible = 1
                UNION ALL
                SELECT
                    tm.id, 
                    'Mambu' as origen,
                    tm.credito,
                    fecha_valor,
                    tm.tipo,
                    tm.monto,
                    tm.correspondencia,
                    tm.resultado
                FROM
                    transaccion_mambu tm
                WHERE
                    ${filtros.join(" AND ")}
                    AND tm.resultado > 0
                    AND tm.visible = 1
            ) AS t
            WHERE
                credito IS NOT NULL
            ORDER BY credito, fecha_valor
            `,
            parametros: [...parametros, ...parametros, ...parametros]
        }

        return await this.post("noConfig", datosConciliacion)
    }

    async eliminar(datos) {
        const qryGeneral = `
            UPDATE
                TABLA
            JOIN (
                SELECT
                    id
                FROM
                    (
                        SELECT
                            id
                        FROM
                            TABLA
                        WHERE
                            correspondencia = ?
                            AND resultado = ?
                    ) AS tmp
                ) AS t ON TABLA.id = t.id
            SET
                correspondencia = NULL,
                resultado = 0
            `
        const qrys = {
            Banco: qryGeneral.replace(/TABLA/g, "transaccion_banco"),
            DWH: qryGeneral.replace(/TABLA/g, "transaccion_dwh"),
            Mambu: qryGeneral.replace(/TABLA/g, "transaccion_mambu"),
            Virtual: qryGeneral.replace(/TABLA/g, "transaccion_virtual")
        }

        qrys.BBVA = qrys.Banco
        qrys.STP = qrys.Banco
        qrys.Conekta = qrys.Banco

        const datos1 = {}
        const datos2 = {}

        datos1.query = qrys[datos.origen]
        datos1.parametros = [datos.correspondencia, datos.resultado]

        datos2.query = qrys[datos.correspondencia]
        datos2.parametros = [datos.origen, datos.id]

        const r1 = await this.post("noConfig", datos1)
        const r2 = await this.post("noConfig", datos2)

        if (!r1.success || !r2.success)
            return { success: false, mensaje: "Error al eliminar correspondencia" }
        return { success: true, mensaje: "Correspondencia eliminada correctamente" }
    }
}

export default ConConciliacionMdl
