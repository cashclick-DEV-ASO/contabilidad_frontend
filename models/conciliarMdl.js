import Modelo from "./modelo.js"

export class ConciliarMdl extends Modelo {
    constructor() {
        super()
    }

    async buscarTransacciones(datos) {
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

        const datosBanco = {
            query: `SELECT id, 'Bancos' as origen, informacion as credito, fecha_valor, tipo, monto, '' as resultado FROM transaccion_banco WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        const datosDWH = {
            query: `SELECT id, 'DWH' as origen, credito, fecha_valor, tipo, monto, '' as resultado FROM transaccion_dwh WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        const datosMambu = {
            query: `SELECT id, 'Mambu' as origen, credito, fecha_valor, tipo, monto, '' as resultado FROM transaccion_mambu WHERE ${filtros.join(
                " AND "
            )}`,
            parametros
        }

        let banco = await this.post("noConfig", datosBanco)
        let DWH = await this.post("noConfig", datosDWH)
        let mambu = await this.post("noConfig", datosMambu)

        let resultado = {
            success: false,
            mensaje: "No se encontraron transacciones a conciliar.",
            datos: []
        }

        if (banco.success) resultado.datos = this.extraeNo(banco.datos)
        if (DWH.success) resultado.datos = resultado.datos.concat(DWH.datos)
        if (mambu.success) resultado.datos = resultado.datos.concat(mambu.datos)

        if (resultado.datos.length > 0) {
            resultado.success = true
            resultado.mensaje = "Transacciones encontradas."
        }

        return resultado
    }

    extraeNo(datos) {
        return datos
            .map((dato) => {
                const credito = dato.credito.substring(11, 20)
                if (isNaN(credito)) return null
                dato.credito = credito
                return dato
            })
            .filter((objeto) => objeto !== null)
    }

    async guardarConciliado(datos) {
        // return await this.post("guardarConciliado", datos)
        return {
            success: true,
            mensaje: "Transacciones conciliadas guardadas correctamente."
        }
    }
}

export default ConciliarMdl
