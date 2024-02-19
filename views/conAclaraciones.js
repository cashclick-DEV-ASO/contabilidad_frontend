import Vista from "./vista.js"
import { ConAclaracionesCtrl as Controlador } from "../controllers/controladores.js"
import { ConAclaracionesMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConAclaraciones extends Vista {
    constructor() {
        super("ConAclaraciones")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta de Aclaraciones")

        this.acciones.estatus = new ListaDesplegable()
            .setTxtEtiqueta("Estatus")
            .setID("estatus")
            .setTxtPhLleno("Todos")
            .setBloquearPh(true)
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.buscar = new Botonera()
            .addBoton("btnBuscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos().setID("tabla")
        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteEditar = true

        this.controlador.cargaInicial()

        return this
    }
}

export default ConAclaraciones
