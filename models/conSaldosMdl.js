import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConSaldosMdl extends Modelo {
    constructor() {
        super()
    }

    async buscar(datos) {
        const filtros = []
        const parametros = []

        if (datos.fechaI) {
            filtros.push("sc.fecha >= ?")
            parametros.push(this.fechaMySQL(datos.fechaI))
        }

        if (datos.fechaF) {
            filtros.push("sc.fecha <= ?")
            parametros.push(this.fechaMySQL(datos.fechaF))
        }

        if (datos.banco !== SYS.DFLT) {
            filtros.push("cb.id_banco = ?")
            parametros.push(datos.banco)
        }

        if (datos.cuenta !== SYS.DFLT) {
            filtros.push("sc.id_cta_bancaria = ?")
            parametros.push(datos.cuenta)
        }

        const datosEnvio = {
            query: `
            SELECT
                sc.id,
                b.nombre AS banco,
                cb.cta,
                sc.fecha,
                sc.saldo_inicial,
                sc.saldo_final
            FROM
                saldo_contable sc
            JOIN
                cuenta_bancaria cb ON sc.id_cta_bancaria = cb.id
            JOIN
                banco b ON cb.id_banco = b.id
            WHERE
                ${filtros.join(" AND ")}
            ORDER BY
                fecha DESC
            `,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }

    async modificar(datos) {
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

    async eliminar(datos) {
        const datosEnvio = {
            query: "DELETE FROM saldo_contable WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConSaldosMdl
