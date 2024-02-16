import Modelo from "./modelo.js"

export class RegTrnDWHMdl extends Modelo {
    constructor() {
        super()
    }

    async guardar(dwh) {
        const trnsToSend = dwh.map((trn) => {
            return [
                trn["fecha inicio"] ?? trn["fecha aprobacion"],
                trn["fecha aprobacion"] ?? trn["fecha inicio"],
                trn["id cliente"],
                trn.credito,
                trn.rfc,
                trn.movimiento === "Dispersion" ? 1 : 2,
                this.monedaToFloat(trn.total),
                this.monedaToFloat(trn.capital),
                this.monedaToFloat(trn.interes),
                this.monedaToFloat(trn.iva)
            ]
        })

        const datos = {
            query: "INSERT INTO transaccion_dwh (fecha_creacion, fecha_valor, cliente, credito, concepto, tipo, monto, capital, interes, iva_interes) VALUES ?",
            parametros: [trnsToSend]
        }

        return await this.post("noConfig", datos)
    }

    txtToFechaMysql(fecha) {
        if (typeof fecha === "object") return fecha
        const [dia, mes, anio] = fecha.split("/")
        return `${anio}-${mes}-${dia}`
    }

    monedaToFloat(monto) {
        if (typeof monto === "number") return monto
        return parseFloat(monto.replace(/[$,]/gi, ""))
    }
}

export default RegTrnDWHMdl
