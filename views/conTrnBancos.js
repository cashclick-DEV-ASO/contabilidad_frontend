import Vista from "./vista.js"
import { ConTrnBancosCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnBancosMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

const CON_TRN_BANCOS = {
    CONTENEDOR: "ConTrnBancos",
    TITULO: "Consulta de Transacciones Bancarias"
}

export class ConTrnBancos extends Vista {
    constructor() {
        super(CON_TRN_BANCOS.CONTENEDOR)
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(CON_TRN_BANCOS.TITULO)

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

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .habilitarBoton(false)
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(
                this.controlador.exportaExcel.bind(this.controlador),
                "Transacciones Bancarias"
            )
            .setValidaModificacion(this.controlador.validaModificacion)
            .setModificaBaseDatos(this.controlador.modificaTransaccion)
            .setEliminaBaseDatos(this.controlador.eliminaTransaccion)

        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteEditar = true
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteOrdenar = true
        this.datos.tabla.permiteAgregar = false
        this.datos.tabla.permiteEliminar = true
        this.datos.tabla.permiteModificar = true
        this.datos.tabla.mostrarNoFila = true

        this.controlador.cargaInicial()

        return this
    }
}

export default ConTrnBancos
