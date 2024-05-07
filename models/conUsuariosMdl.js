import { SYS } from "../src/constantes.js"
import Modelo from "./modelo.js"

export class ConUsuariosMdl extends Modelo {
    constructor() {
        super()
    }

    async buscar(params) {
        const query = `SELECT u.id, p.nombre perfil, u.nombre1 primer_nombre, u.nombre2 segundo_nombre, u.apellido1 primer_apellido, u.apellido2 segundo_apellido, u.usuario, CASE u.activo WHEN 1 THEN 'Si' WHEN 0 THEN 'No' ELSE 'No especificado' END AS activo FROM usuario u JOIN perfil p ON u.id_perfil = p.id`

        const datos = {
            query,
            parametros: params !== SYS.DFLT ? [params] : []
        }

        return await this.post("noConfig", datos)
    }

    async modificaTransaccion(datos) {
        const datosEnvio = {
            query: `UPDATE usuario SET nombre1 = ?, nombre2 = ?, apellido1 = ?, apellido2 = ?, usuario = ?, id_perfil = ?, activo = ? WHERE id = ?`,
            parametros: [
                datos.primer_nombre,
                datos.segundo_nombre,
                datos.primer_apellido,
                datos.segundo_apellido,
                datos.usuario,
                datos.perfil,
                datos.activo,
                datos.id
            ]
        }

        return await this.post("noConfig", datosEnvio)
    }

    async eliminaTransaccion(datos) {
        const datosEnvio = {
            query: "DELETE FROM usuario WHERE id = ?",
            parametros: [datos.id]
        }

        return await this.post("noConfig", datosEnvio)
    }
}

export default ConUsuariosMdl
