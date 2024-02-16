import Modelo from "./modelo.js"

import { SYS } from "../src/constantes.js"

export class ConTrnDWHMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransaccionesDWH(datos) {
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

        if (datos.tipo && datos.tipo.valor !== SYS.DFLT) {
            filtros.push("tipo = ?")
            parametros.push(datos.tipo.valor)
        }

        const datosEnvio = {
            query: `SELECT fecha_creacion, fecha_valor, cliente, credito, concepto, tipo, monto, capital, interes, iva_interes, penalizacion, iva_penalizacion FROM transaccion_dwh WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnDWHMdl
