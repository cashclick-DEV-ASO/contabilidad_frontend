import Modelo from "./modelo.js"

export class LayoutModel extends Modelo {
	constructor() {
		super()
	}

	async getLayout(id) {
		return await this.get(`${id}`)
	}

	async actualizaLayout(lyt) {
		const datos = {
			query: `UPDATE layout SET alias = ?, extensiones = ?, layout = ? WHERE id = ?`,
			parametros: [lyt.alias, lyt.extensiones, lyt.layout, lyt.id],
		}

		return await this.patch("noConfig", datos)
	}

	async nuevoLayout(lyt) {
		const datos = {
			query: `INSERT INTO layout (id_banco, alias, extensiones, layout) VALUES (?, ?, ?, ?)`,
			parametros: [lyt.id_banco, lyt.alias, lyt.extensiones, lyt.layout],
		}

		return await this.post("noConfig", datos)
	}
}

export default LayoutModel
