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

        this.acciones.periodoI = new Periodo()
            .setID("periodoI")
            .setTitulo("Periodo Inicial")
            .setListener(this.controlador.cambiaPeriodo)

        this.acciones.periodoF = new Periodo()
            .setID("periodoF")
            .setTitulo("Periodo Final")
            .setListener(this.controlador.cambiaPeriodo)

        this.acciones.consultar = new Botonera()
            .addBoton("btnConsultar")
            .setIDContenedor("consultar")
            .setTexto("Consultar")
            .setListener(this.controlador.consultar)

        this.datos.tb_titulo = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloTrns"
        }).setTexto("Transacciones Bancos")

        this.datos.tb_noTrn = new MuestraDato()
            .setID("tb_noTrn")
            .setTxtEtiqueta("Totales:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tb_noTrnOK = new MuestraDato()
            .setID("tb_noTrnOK")
            .setTxtEtiqueta("OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tb_noTrnNoOK = new MuestraDato()
            .setID("tb_noTrnNoOK")
            .setTxtEtiqueta("No OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.td_titulo = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloTrns"
        }).setTexto("Transacciones DWH")

        this.datos.td_noTrn = new MuestraDato()
            .setID("td_noTrn")
            .setTxtEtiqueta("Totales:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.td_noTrnOK = new MuestraDato()
            .setID("td_noTrnOK")
            .setTxtEtiqueta("OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.td_noTrnNoOK = new MuestraDato()
            .setID("td_noTrnNoOK")
            .setTxtEtiqueta("No OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tm_titulo = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloTrns"
        }).setTexto("Transacciones Mambu")

        this.datos.tm_noTrn = new MuestraDato()
            .setID("tm_noTrn")
            .setTxtEtiqueta("Totales:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tm_noTrnOK = new MuestraDato()
            .setID("tm_noTrnOK")
            .setTxtEtiqueta("OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tm_noTrnNoOK = new MuestraDato()
            .setID("tm_noTrnNoOK")
            .setTxtEtiqueta("No OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tl_titulo = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloTrns"
        }).setTexto("Transacciones Total")

        this.datos.tl_noTrn = new MuestraDato()
            .setID("tl_noTrn")
            .setTxtEtiqueta("Totales:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tl_noTrnOK = new MuestraDato()
            .setID("tl_noTrnOK")
            .setTxtEtiqueta("OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        this.datos.tl_noTrnNoOK = new MuestraDato()
            .setID("tl_noTrnNoOK")
            .setTxtEtiqueta("No OK:")
            .setEstilo4()
            .setTxtDato(this.controlador.plantillaInicial)

        return this
    }
}

export default ResConciliacion
