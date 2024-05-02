import Modelo from "./modelo.js"

export class RegTrnMambuMdl extends Modelo {
    constructor() {
        super()
    }

    guardar = async (transacciones, periodo) => {
        const trnsToSend = transacciones.map((trn) => {
            return [
                periodo,
                this.txtToFechaMysql(
                    trn["Fecha programada de pago"] === ""
                        ? trn["Fecha de pago"]
                        : trn["Fecha programada de pago"]
                ),
                this.txtToFechaMysql(
                    trn["Fecha de pago"] === ""
                        ? trn["Fecha programada de pago"]
                        : trn["Fecha de pago"]
                ),
                trn["ID cliente"],
                trn["ID crédito"],
                trn["Folio"],
                trn["Medio de pago"],
                1,
                trn["Importe Pago"],
                trn["No. pago"]
            ]
        })

        const datos = {
            query: "INSERT INTO transaccion_mambu (periodo, fecha_creacion, fecha_valor, cliente, credito, identificador_bancario, concepto, tipo, monto, informacion) VALUES ?",
            parametros: [trnsToSend]
        }

        return await this.post("noConfig", datos)
    }

    txtToFechaMysql(fecha) {
        if (!fecha) return null
        if (typeof fecha === "object")
            fecha = fecha.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            })
        const [dia, mes, anio] = fecha.split("/")
        return `${anio}-${mes}-${dia}`
    }
}

export default RegTrnMambuMdl
