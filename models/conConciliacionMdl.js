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

        const datosEnvio = {
            query: `SELECT fecha_creacion, fecha_valor, cliente, credito, tipo, monto, 'OK' as resultado FROM transaccion_mambu WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConConciliacionMdl
