import { SYS } from "../src/constantes.js"
import Modelo from "./modelo.js"

export class RegUsuariosMdl extends Modelo {
    constructor() {
        super()
    }

    async guardar(datos) {
        const datosValidacion = {
            query: `SELECT COUNT(*) AS CONTEO FROM usuario WHERE usuario = ?`,
            parametros: [datos.correo]
        }

        const resValidacion = await this.post("noConfig", datosValidacion)
        if (!resValidacion.success) return resValidacion

        if (resValidacion.datos[0].CONTEO > 0) {
            return {
                success: false,
                mensaje: "El correo ya se encuentra registrado"
            }
        }

        const datosInsert = {
            query: `INSERT INTO usuario (nombre1, nombre2, apellido1, apellido2, usuario, password, id_perfil) VALUES (?, ?, ?, ?, ?, AES_ENCRYPT(?, 'save_pa$$'), ?)`,
            parametros: [
                datos.nombre1,
                datos.nombre2,
                datos.apellido1,
                datos.apellido2,
                datos.correo,
                datos.password,
                datos.perfil
            ]
        }

        return await this.post("noConfig", datosInsert)
    }
}

export default RegUsuariosMdl
