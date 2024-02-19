import Vista from "./vista.js"
import { CarteraCtrl as Controlador } from "../controllers/controladores.js"
import { CarteraMdl as Modelo } from "../models/modelos.js"

import { Periodo, Botonera, Componente, MuestraDato } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Cartera extends Vista {
    constructor() {
        super("Cartera")
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

        this.datos.tituloTrn = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloTrns"
        }).setTexto("Clientes")
        this.datos.noClnt = new MuestraDato().setTxtEtiqueta("Totales:")
        this.datos.noClntOK = new MuestraDato().setTxtEtiqueta("Activos:")
        this.datos.noClntNoOK = new MuestraDato().setTxtEtiqueta("Inactivos:")

        this.datos.tituloAbonos = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloAbonos"
        }).setTexto("Créditos")
        this.datos.noCreditos = new MuestraDato().setTxtEtiqueta("Totales:")
        this.datos.noCreditosAct = new MuestraDato().setTxtEtiqueta("Activos:")
        this.datos.noCreditosLiq = new MuestraDato().setTxtEtiqueta("Liquidados:")
        this.datos.noCreditosVen = new MuestraDato().setTxtEtiqueta("Vencidos:")

        this.datos.tituloCargos = new Componente(SYS.LBL, {
            clase: "tituloRes",
            id: "tituloCargos"
        }).setTexto("Cartera")
        this.datos.carActiva = new MuestraDato().setTxtEtiqueta("Activa:")
        this.datos.carVencida = new MuestraDato().setTxtEtiqueta("Vencida:")

        this.controlador.cargaInicial()

        return this
    }
}

export default Cartera
