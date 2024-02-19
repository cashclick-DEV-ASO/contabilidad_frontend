import Vista from "./vista.js"
import { ResConciliacionCtrl as Controlador } from "../controllers/controladores.js"
import { ResConciliacionMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente, MuestraDato, Periodo } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class ResConciliacion extends Vista {
    constructor() {
        super("ResConciliacion")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Resumen de Conciliación")

        this.acciones.periodoI = new Periodo().setID("periodoI").setTitulo("Periodo Inicial")
        this.acciones.periodoF = new Periodo().setID("periodoF").setTitulo("Periodo Final")

        this.acciones.consultar = new Botonera()
            .addBoton("btnConsultar")
            .setIDContenedor("consultar")
            .setTexto("Consultar")
            .setListener(this.controlador.consultar)

        this.datos.tituloTrn = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloTrns"
        }).setTexto("Transacciones")
        this.datos.noTrn = new MuestraDato().setID("noTrn").setTxtEtiqueta("Totales:")
        this.datos.noTrnOK = new MuestraDato().setID("noTrnOK").setTxtEtiqueta("OK:")
        this.datos.noTrnNoOK = new MuestraDato().setID("noTrnNoOK").setTxtEtiqueta("No OK:")

        this.datos.tituloAbonos = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloAbonos"
        }).setTexto("Abonos")
        this.datos.noAbonos = new MuestraDato().setID("noAbonos").setTxtEtiqueta("Totales:")
        this.datos.noAbonosOK = new MuestraDato().setID("noAbonosOK").setTxtEtiqueta("OK:")
        this.datos.noAbonosNoOK = new MuestraDato().setID("noAbonosNoOK").setTxtEtiqueta("No OK:")

        this.datos.tituloCargos = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloCargos"
        }).setTexto("Cargos")
        this.datos.noCargos = new MuestraDato().setID("noCargos").setTxtEtiqueta("Totales:")
        this.datos.noCargosOK = new MuestraDato().setID("noCargosOK").setTxtEtiqueta("OK:")
        this.datos.noCargosNoOK = new MuestraDato().setID("noCargosNoOK").setTxtEtiqueta("No OK:")

        this.controlador.cargaInicial()

        return this
    }
}

export default ResConciliacion
