import Vista from "./vista.js"
import { ConConciliacionCtrl as Controlador } from "../controllers/controladores.js"
import { ConConciliacionMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ConConciliacion extends Vista {
    constructor() {
        super("ConConciliacion")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta transacciones conciliadas")

        this.acciones.fechaI = new SolicitaDato()
            .setID("fechaI")
            .setTipo("date")
            .setTxtEtiqueta("Fecha Inicial")
            .setValorFecha(new Date())
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato()
            .setID("fechaF")
            .setTipo("date")
            .setTxtEtiqueta("Fecha Final")
            .setValorFecha(new Date())
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(this.controlador.exportaExcel.bind(this.controlador))
        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteEditar = true

        return this
    }
}

export default ConConciliacion
