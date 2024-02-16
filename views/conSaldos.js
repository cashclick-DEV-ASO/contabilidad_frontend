import Vista from "./vista.js"
import { ConSaldosCtrl as Controlador } from "../controllers/controladores.js"
import { ConSaldosMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

const CON_SALDOS = {
    CONTENEDOR: "ConSaldos",
    TITULO: "Consulta de Saldos Contables"
}

export class ConSaldos extends Vista {
    constructor() {
        super(CON_SALDOS.CONTENEDOR)
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(CON_SALDOS.TITULO)

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.cuenta = new ListaDesplegable()
            .setTxtEtiqueta("Cuenta")
            .setID("cuenta")
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioCuenta)

        this.acciones.fechaI = new SolicitaDato()
            .setID("fechaI")
            .setTipo("date")
            .setTxtEtiqueta("Fecha Inicial")
            .setValorFecha(new Date())
            .setPropiedad("max", new Date().toISOString().split("T")[0])
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato()
            .setID("fechaF")
            .setTipo("date")
            .setTxtEtiqueta("Fecha Final")
            .setValorFecha(new Date())
            .setPropiedad("max", new Date().toISOString().split("T")[0])
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)
            .habilitarBoton(false)

        this.datos.tabla = new TablaDatos().setID("tabla")
        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteEditar = true

        this.controlador.cargaInicial()

        return this
    }
}

export default ConSaldos
