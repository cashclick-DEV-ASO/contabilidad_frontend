import Modelo from "./modelo.js"

export class ConTrnMambuMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransaccionesMambu(datos) {
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

        const datosEnvio = {
            query: `SELECT fecha_creacion, fecha_valor, cliente, credito, identificador_bancario, concepto, tipo, monto, informacion FROM transaccion_mambu WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConTrnMambuMdl
