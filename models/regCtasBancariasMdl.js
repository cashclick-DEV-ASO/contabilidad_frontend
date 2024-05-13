import Modelo from "./modelo.js"

export class RegCtasBancariasMdl extends Modelo {
    constructor() {
        super()
    }

    async guardar(paramsCuenta, paramsSaldo) {
        const qryValidaCuenta = `SELECT COUNT(*) AS conteo FROM cuenta_bancaria WHERE cta = ? AND id_banco = ?`
        const resValidaCuenta = await this.post("noConfig", {
            query: qryValidaCuenta,
            parametros: [paramsCuenta[0], paramsCuenta[1]]
        })
        if (resValidaCuenta.error) return resValidaCuenta
        if (resValidaCuenta.datos[0]["conteo"] > 0)
            return { error: "El número de cuenta ya está registrado en el banco seleccionado." }

        const datosCuenta = {
            query: `INSERT INTO cuenta_bancaria
            (cta, id_banco, comentarios)
            VALUES(?, ?, ?)`,
            parametros: paramsCuenta
        }

        const res = await this.post("noConfig", datosCuenta)
        if (res.error) return res

        paramsSaldo.push(res.datos[0].insertId)
        const datosSaldo = {
            query: `INSERT INTO saldo_contable
            (fecha, saldo_inicial, saldo_final, id_cta_bancaria)
            VALUES(?, ?, ?, ?)`,
            parametros: paramsSaldo
        }

        return await this.post("noConfig", datosSaldo)
    }

    async getBancosTodos() {
        const query = `SELECT id, nombre FROM banco ORDER BY nombre`
        return this.getInformacionComponentes(query)
    }
}

export default RegCtasBancariasMdl
