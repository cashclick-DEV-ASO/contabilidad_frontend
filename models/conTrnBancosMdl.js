import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConTrnBancosMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
        const filtros = []
        const parametros = []
        const filtrosV = ["origen = 'Banco'"]
        const parametrosV = []

        if (datos.fechaI) {
            filtros.push("fecha_valor >= ?")
            parametros.push(datos.fechaI)
            filtrosV.push("fecha_valor >= ?")
            parametrosV.push(datos.fechaI)
        }

        if (datos.fechaF) {
            filtros.push("fecha_valor <= ?")
            parametros.push(datos.fechaF)
            filtrosV.push("fecha_valor <= ?")
            parametrosV.push(datos.fechaF)
        }

        if (datos.banco && datos.banco.valor !== SYS.DFLT) {
            filtros.push("id_banco = ?")
            parametros.push(datos.banco.valor)
            filtrosV.push("id = ?")
            parametrosV.push("0")
        }

        const datosEnvio = {
            query: `
            SELECT 
                tb.id,
                ec.periodo,
                (SELECT b.nombre FROM banco b WHERE b.id = ec.id_banco) AS banco,
                tb.informacion,
                tb.fecha_creacion,
                tb.fecha_valor,
                tb.concepto,
                tb.tipo,
                tb.monto
            FROM
                transaccion_banco tb
            RIGHT JOIN
                edo_cta ec ON tb.id_edo_cta = ec.id
            WHERE
            ${filtros.join(" AND ")}
            UNION ALL
            SELECT
                tv.id,
                tv.periodo,
                'Virtual' AS banco,
                NULL,
                tv.fecha_registro,
                tv.fecha_valor,
                NULL,
                tv.tipo,
                tv.monto
            FROM
                transaccion_virtual tv
            WHERE
                ${filtrosV.join(" AND ")}
            `,
            parametros: parametros.concat(parametrosV)
        }

        return await this.post("noConfig", datosEnvio)
    }

    async insertaTransaccion(datos) {
        const informacion = datos.banco + "||" + datos.informacion + "||" + datos.concepto

        const datosEnvio = {
            query: "INSERT INTO transaccion_virtual (periodo, origen, tipo, monto, fecha_valor, informacion) VALUES (?, ?, ?, ?, ?, ?)",
            parametros: [
                datos.periodo,
                "Banco",
                datos.tipo,
                datos.monto,
                this.fechaMySQL(datos.fecha_valor),
                informacion
            ]
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
