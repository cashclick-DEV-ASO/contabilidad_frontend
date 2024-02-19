import Vista from "./vista.js"
import { RecalculoCapitalCtrl as Controlador } from "../controllers/controladores.js"
import { RecalculoCapitalMdl as Modelo } from "../models/modelos.js"

import { Botonera, Periodo, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RecalculoCapital extends Vista {
    constructor() {
        super("RecalculoCapital")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Recalculo de Capital")

        this.acciones.periodoI = new Periodo().setID("periodoI").setTitulo("Periodo Inicial")
        this.acciones.periodoF = new Periodo().setID("periodoF").setTitulo("Periodo Final")

        this.acciones.consultar = new Botonera()
            .addBoton("btnConsultar")
            .setIDContenedor("consultar")
            .setTexto("Consultar")
            .setListener(this.controlador.consultar)

        this.datos.tabla = new TablaDatos().setID("tabla")
        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteEditar = true

        return this
    }
}

export default RecalculoCapital
