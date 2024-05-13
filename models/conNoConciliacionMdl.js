import Modelo from "./modelo.js"

export class ConNoConciliacionMdl extends Modelo {
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
                    null as conciliar
                FROM
                    transaccion_banco tb
                RIGHT JOIN
                    edo_cta ec ON tb.id_edo_cta = ec.id
                WHERE
                    ${filtros.join(" AND ")}
                    AND tb.resultado = 0
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
                    null as resultado
                FROM
                    transaccion_dwh td
                WHERE
                    ${filtros.join(" AND ")}
                    AND td.resultado = 0
                    AND td.visible = 1
                UNION ALL
                SELECT
                    tm.id, 
                    'Mambu' as origen,
                    tm.credito,
                    fecha_valor,
                    tm.tipo,
                    tm.monto,
                    null as resultado
                FROM
                    transaccion_mambu tm
                WHERE
                    ${filtros.join(" AND ")}
                    AND tm.resultado = 0
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

    async guardar(datos) {
        const qrys = {
            Banco: "UPDATE transaccion_banco SET correspondencia = ?, resultado = ? WHERE id = ?",
            DWH: "UPDATE transaccion_dwh SET correspondencia = ?, resultado = ? WHERE id = ?",
            Mambu: "UPDATE transaccion_mambu SET correspondencia = ?, resultado = ? WHERE id = ?",
            Virtual:
                "UPDATE transaccion_virtual SET correspondencia = ?, resultado = ? WHERE id = ?"
        }
        qrys.BBVA = qrys.Banco
        qrys.STP = qrys.Banco
        qrys.Conekta = qrys.Banco

        for (let index = 0; index < datos.length; index++) {
            const dato = datos[index]
            let r = null

            if (!qrys[dato.origen])
                return {
                    success: false,
                    mensaje: "No fue posible identificar el origen de una transacción."
                }

            r = await this.post("noConfig", {
                query: qrys[dato.origen],
                parametros: [dato.correspondencia, dato.resultado, dato.id]
            })

            if (r && !r.success)
                return {
                    success: false,
                    mensaje: "Error al guardar las transacciones."
                }
        }

        return {
            success: true,
            mensaje: "Transacciones guardadas correctamente."
        }
    }
}

export default ConNoConciliacionMdl
