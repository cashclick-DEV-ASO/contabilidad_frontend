import Vista from "./vista.js"
import { RegUsuariosCtrl as Controlador } from "../controllers/controladores.js"
import { RegUsuariosMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class RegUsuarios extends Vista {
    constructor() {
        super("RegUsuarios")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta de Cuentas Bancarias")

        return this
    }
}

export default RegUsuarios
