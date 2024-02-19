import Modelo from "./modelo.js"

export class ConCtasBancariasMdl extends Modelo {
    constructor() {
        super()
    }

    async consultar(dwh) {
        const trnsToSend = {}

        const datos = {
            query: "INSERT INTO transaccion_dwh (fecha_creacion, fecha_valor, cliente, credito, concepto, tipo, monto, capital, interes, iva_interes) VALUES ?",
            parametros: [trnsToSend]
        }

        return await this.post("noConfig", datos)
    }
}

export default ConCtasBancariasMdl
