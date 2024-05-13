import { SYS } from "../src/constantes.js"
import Modelo from "./modelo.js"

export class ConCtasBancariasMdl extends Modelo {
    constructor() {
        super()
    }

    async buscar(params) {
        const datos = {
            query: `
            SELECT
                cb.id id_c,
                b.id id_b,
                cb.fecha_registro,
                (SELECT MIN(fecha) FROM saldo_contable WHERE id_cta_bancaria = cb.id) fecha_apertura,
                cb.cta no_cuenta,
                b.nombre banco,
                cb.comentarios
            FROM
                cuenta_bancaria cb
                JOIN banco b ON cb.id_banco = b.id
            WHERE
                cb.activa = 1
                ${params !== SYS.DFLT ? "AND cb.id_banco = ?" : ""}
            `,
            parametros: params !== SYS.DFLT ? [params] : []
        }

        return await this.post("noConfig", datos)
    }

    async modificar(datos) {
        const datosEnvio = {
            query: `UPDATE cuenta_bancaria SET cta = ?, id_banco = ?, comentarios = ? WHERE id = ?`,
            parametros: [datos.no_cuenta, datos.id_b, datos.comentarios, datos.id_c]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminar(datos) {
        const datosEnvio = {
            query: "UPDATE cuenta_bancaria SET activa = 0 WHERE id = ?",
            parametros: [datos.id_c]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConCtasBancariasMdl
