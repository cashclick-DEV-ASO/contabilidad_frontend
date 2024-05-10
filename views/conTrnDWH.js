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
            .setTxtEtiqueta("Fecha Inicial")
            .setModoFecha()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato(SYS.DT)
            .setID("fechaF")
            .setTxtEtiqueta("Fecha Final")
            .setModoFecha()
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

        this.datos.tabla.camposEspeciales = {
            monto: () => {
                return new SolicitaDato().setTxtEtiqueta("Monto").setEstilo1().setModoMoneda()
            },
            capital: () => {
                return new SolicitaDato().setTxtEtiqueta("Capital").setEstilo1().setModoMoneda()
            },
            interes: () => {
                return new SolicitaDato().setTxtEtiqueta("Interés").setEstilo1().setModoMoneda()
            },
            iva_interes: () => {
                return new SolicitaDato().setTxtEtiqueta("IVA interés").setEstilo1().setModoMoneda()
            },
            penalizacion: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Penalización")
                    .setEstilo1()
                    .setModoMoneda()
            },
            iva_penalizacion: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("IVA penalización")
                    .setEstilo1()
                    .setModoMoneda()
            },
            fecha_creacion: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Creación")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            fecha_valor: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Valor")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            tipo: () => {
                return new ListaDesplegable().setTxtEtiqueta("Tipo").setOpciones([
                    { valor: 0, texto: "No Identificado" },
                    { valor: 1, texto: "Cargo" },
                    { valor: 2, texto: "Abono" }
                ])
            }
        }

        this.controlador.cargaInicial()

        return this
    }
}

export default ConTrnDWH
