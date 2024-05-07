import Vista from "./vista.js"
import { ConTrnDWHCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnDWHMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const CON_TRN_DWH = {
    CONTENEDOR: "ConTrnDWH",
    TITULO: "Consulta de Transacciones del DWH"
}

export class ConTrnDWH extends Vista {
    constructor() {
        super(CON_TRN_DWH.CONTENEDOR)
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(CON_TRN_DWH.TITULO)

        this.acciones.fechaI = new SolicitaDato(SYS.DT)
            .setID("fechaI")
            .setModoFecha()
            .setTxtEtiqueta("Fecha Inicial")
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato(SYS.DT)
            .setID("fechaF")
            .setModoFecha()
            .setTxtEtiqueta("Fecha Final")
            .setValorFecha(new Date())
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.tipo = new ListaDesplegable()
            .setTxtEtiqueta("Tipo de Transacción")
            .setID("tipoTrn")
            .setTxtPhLleno("Todos")
            .setListener(SYS.CHNG, this.controlador.cambioTipo)
        this.acciones.tipo.bloqueaPh = true

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(
                this.controlador.exportaExcel.bind(this.controlador),
                "Transacciones DWH"
            )
            .setValidaModificacion(this.controlador.validaModificacion)
            .setModificaBaseDatos(this.controlador.modificaTransaccion)
            .setEliminaBaseDatos(this.controlador.eliminaTransaccion)

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = true
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = true
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 4) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        this.controlador.cargaInicial()

        return this
    }
}

export default ConTrnDWH
