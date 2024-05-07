import { SYS } from "../src/constantes.js"
import Modelo from "./modelo.js"

export class ConCtasBancariasMdl extends Modelo {
    constructor() {
        super()
    }

    async buscar(params) {
        const query = `SELECT cb.id id_c, b.id id_b, cb.cta no_cuenta, b.nombre banco, cb.comentarios FROM cuenta_bancaria cb JOIN banco b ON cb.id_banco = b.id`
        if (params !== SYS.DFLT) query += " WHERE id_banco = ?"

        const datos = {
            query,
            parametros: params !== SYS.DFLT ? [params] : []
        }

        return await this.post("noConfig", datos)
    }

    async modificaTransaccion(datos) {
        const datosEnvio = {
            query: `UPDATE cuenta_bancaria SET cta = ?, id_banco = ?, comentarios = ? WHERE id = ?`,
            parametros: [datos.no_cuenta, datos.id_b, datos.comentarios, datos.id_c]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM cuenta_bancaria WHERE id = ?",
            parametros: [datos.id_c]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConCtasBancariasMdl
