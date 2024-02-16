import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ResConciliacionCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    consultar = async () => {
        this.msjContinuar(
            `Se guardará la información del archivo:<br><br>${this.acciones.selArchivo.ruta.name}<br><br>¿Desea continuar?`,
            {
                txtSi: "Si, guardar",
                txtNo: "No, cancelar",
                callbackSi: this.preparaDatos
            }
        )
    }
}

export default ResConciliacionCtrl
