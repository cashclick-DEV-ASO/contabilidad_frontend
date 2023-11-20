import Modelo from "./modelo.js"

export class LayoutMdl extends Modelo {
	constructor() {
		super()
	}

	async getLayout(id) {
		return await this.get(`${id}`)
	}

	async actualizaLayout(lyt) {
		const datos = {
			query: `UPDATE layout SET extensiones = ?, layout = ?, tipo = ? WHERE id = ?`,
			parametros: [lyt.extension, lyt.layout, lyt.tipo, lyt.valor],
		}

		return await this.patch("noConfig", datos)
	}

	async nuevoLayout(lyt) {
		const datos = {
			query: `INSERT INTO layout (id_banco, alias, extensiones, layout, tipo) VALUES (?, ?, ?, ?, ?)`,
			parametros: [lyt.id_banco, lyt.alias, lyt.extensiones, lyt.layout, lyt.tipo],
		}
		return await this.post("noConfig", datos)
	}

	async eliminaLayout(id) {
		const datos = {
			query: `DELETE FROM layout WHERE id = ?`,
			parametros: [id],
		}

		return await this.post("noConfig", datos)
	}
}

export default LayoutMdl
