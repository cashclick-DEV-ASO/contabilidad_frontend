import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConUsuariosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            saldo: this.formatoModena
        }
    }

    buscar = async () => {
        const datos = await this.modelo.buscar()
        if (!datos.success) return this.msjError(datos.mensaje)

        this.datos.tabla.parseaJSON(datos.datos, null, this.formatoTabla, ["id"]).actualizaTabla()
    }

    validaModificacion = (datos) => {
        return Object.keys(datos).some((dato) => {
            if (dato.toLowerCase().includes("primer_nombre") && !datos[dato]) {
                this.msjError("El campo Primer Nombre no puede estar vacío.")
                return true
            }
            if (dato.toLowerCase().includes("primer_apellido") && !datos[dato]) {
                this.msjError("El campo Primer Apellido no puede estar vacío.")
                return true
            }
            if (dato.toLowerCase().includes("correo")) {
                if (!datos[dato]) {
                    this.msjError("El campo Correo no puede estar vacío.")
                    return true
                }
                const regCorreo = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
                if (!regCorreo.test(datos[dato])) {
                    this.msjError("El campo Correo no es válido.")
                    return true
                }
            }
            if (dato.toLowerCase().includes("perfil") && !datos[dato]) {
                this.msjError("El campo Perfil no puede estar vacío.")
                return true
            }
            if (dato.toLowerCase().includes("activo")) {
                if (!datos[dato]) {
                    this.msjError("El campo Activo no puede estar vacío.")
                    return true
                }
                if (datos[dato] !== "1" && datos[dato] !== "0") {
                    this.msjError("El campo Activo no es válido.")
                    return true
                }
            }
        })
    }
}

export default ConUsuariosCtrl
