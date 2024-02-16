import Modelo from "./modelo.js"

export class RegSaldosMdl extends Modelo {
    constructor() {
        super()
    }

    async registraSaldo(saldo) {
        const validacion = {
            query: `SELECT * FROM saldo_contable WHERE fecha = ? AND id_cta_contable = ?`,
            parametros: [saldo.fecha, saldo.idCtaContable]
        }

        const resultadoValidacion = await this.post("noConfig", validacion)

        if (!resultadoValidacion.success)
            return {
                success: false,
                mensaje: "Error al validar el saldo."
            }

        if (resultadoValidacion.datos.length > 0)
            return {
                success: false,
                mensaje: "Ya existe un saldo registrado para esta cuenta en esta fecha."
            }

        const datos = {
            query: `INSERT INTO saldo_contable (fecha, saldo_inicial, saldo_final, id_cta_contable) VALUES (?, ?, ?, ?)`,
            parametros: [saldo.fecha, saldo.saldoI, saldo.saldoF, saldo.idCtaContable]
        }

        return await this.post("noConfig", datos)
    }
}

export default RegSaldosMdl
