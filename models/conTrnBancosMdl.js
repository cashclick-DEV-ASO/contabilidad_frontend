import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConTrnBancosMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransaccionesBancos(datos) {
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

        if (datos.banco && datos.banco.valor !== SYS.DFLT) {
            filtros.push("id_banco = ?")
            parametros.push(datos.banco.valor)
        }

        const datosEnvio = {
            query: `SELECT id, informacion, fecha_creacion, fecha_valor, concepto, tipo, monto FROM transaccion_banco WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }

    async modificaTransaccion(datos) {
        const datosEnvio = {
            query: `UPDATE transaccion_banco SET informacion = ?, fecha_creacion = ?, fecha_valor = ?, concepto = ?, tipo = ?, monto = ? WHERE id = ?`,

            parametros: [
                datos.informacion,
                this.fechaMySQL(datos.fecha_creacion),
                this.fechaMySQL(datos.fecha_valor),
                datos.concepto,
                datos.tipo,
                datos.monto,
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM transaccion_banco WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnBancosMdl
