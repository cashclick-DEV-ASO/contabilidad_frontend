import Vista from "./vista.js"
import { ConCtasBancariasCtrl as Controlador } from "../controllers/controladores.js"
import { ConCtasBancariasMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConCtasBancarias extends Vista {
    constructor() {
        super("ConCtasBancarias")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta de Cuentas Bancarias")

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setEstilo2()
            .setTxtPhLleno("Todos")
            .setBloquearPh(false)
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.consultar = new Botonera()
            .addBoton("btnConsultar")
            .setIDContenedor("consultar")
            .setTexto("Consultar")
            .setListener(this.controlador.consultar)

        this.datos.tabla = new TablaDatos().setID("tabla")
        this.datos.tabla.permiteFiltro = false
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteEditar = true

        this.controlador.cargaInicial()

        return this
    }
}

export default ConCtasBancarias
