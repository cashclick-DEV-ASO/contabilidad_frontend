import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConSaldosMdl extends Modelo {
    constructor() {
        super()
    }

    async consultaSaldoCuenta(datos) {
        const filtros = []
        const parametros = []

        if (datos.fechaI) {
            filtros.push("fecha >= ?")
            parametros.push(datos.fechaI)
        }

        if (datos.fechaF) {
            filtros.push("fecha <= ?")
            parametros.push(datos.fechaF)
        }

        if (datos.cuenta !== SYS.DFLT) {
            filtros.push("id_cta_contable = ?")
            parametros.push(datos.cuenta)
        }

        const datosEnvio = {
            query: `SELECT id, fecha, saldo_inicial, saldo_final FROM saldo_contable WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }

    async modificaTransaccion(datos) {
        const datosEnvio = {
            query: `UPDATE saldo_contable SET fecha = ?, saldo_inicial = ?, saldo_final = ? WHERE id = ?`,

            parametros: [
                this.fechaMySQL(datos.fecha),
                datos.saldo_inicial,
                datos.saldo_final,
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM saldo_contable WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConSaldosMdl
