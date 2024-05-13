import Modelo from "./modelo.js"

export class RegSaldosMdl extends Modelo {
    constructor() {
        super()
    }

    async guardar(saldo) {
        const validacion = {
            query: `
            SELECT
                *
            FROM
                saldo_contable
            JOIN
                cuenta_bancaria ON saldo_contable.id_cta_bancaria = cuenta_bancaria.id
            WHERE
                fecha = ?
                AND id_cta_bancaria = ?
            `,
            parametros: [saldo.fecha, saldo.idCtaContable]
        }

        const resultadoValidacion = await this.post("noConfig", validacion)

        if (!resultadoValidacion.success)
            return {
                success: false,
                mensaje: "Error al validar el saldo."
            }

        if (resultadoValidacion.datos.length > 0) {
            let f = new Date(saldo.fecha).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            })
            return {
                success: false,
                mensaje: `Los saldos de la cuenta ${resultadoValidacion.datos[0].cta} para el día ${f} ya han sido registrados.`
            }
        }

        const datos = {
            query: `INSERT INTO saldo_contable (fecha, saldo_inicial, saldo_final, id_cta_bancaria) VALUES (?, ?, ?, ?)`,
            parametros: [saldo.fecha, saldo.saldoI, saldo.saldoF, saldo.idCtaContable]
        }

        return await this.post("noConfig", datos)
    }

    async saldosRegistrados(idCtaBancaria, fecha) {
        const validacionSaldoAnterior = {
            query: `
            SELECT 
                COALESCE((SELECT saldo_final FROM saldo_contable WHERE fecha = date_add(DATE(?), INTERVAL -1 DAY)), 'ND') AS saldo_inicial,
                COALESCE((SELECT saldo_inicial FROM saldo_contable WHERE fecha = date_add(DATE(?), INTERVAL 1 DAY)), 'ND') AS saldo_final
            FROM 
                saldo_contable
            WHERE 
                id_cta_bancaria = ?
            LIMIT 1
            `,
            parametros: [this.fechaMySQL(fecha), this.fechaMySQL(fecha), idCtaBancaria]
        }

        return await this.post("noConfig", validacionSaldoAnterior)
    }
}

export default RegSaldosMdl
