import Modelo from "./modelo.js"

export class ConTrnBancosMdl extends Modelo {
	constructor() {
		super()
	}

	async buscarTransaccionesBancos(datos) {
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

		if (datos.banco && datos.banco.valor !== SYS.DFLT) {
			filtros.push("id_edo_cta in (SELECT id_edo_cta FROM edo_cta WHERE id_cuenta = ?)")
			parametros.push(datos.banco.valor)
		}

		const datosEnvio = {
			query: `SELECT informacion, fecha_creacion, fecha_valor, concepto, tipo, monto FROM transaccion_banco WHERE ${filtros.join(
				" AND "
			)}`,
			parametros,
		}

		return await this.post("noConfig", datosEnvio)
	}
}

export default ConTrnBancosMdl
