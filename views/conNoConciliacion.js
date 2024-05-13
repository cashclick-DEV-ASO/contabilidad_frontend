import Vista from "./vista.js"
import { ConNoConciliacionCtrl as Controlador } from "../controllers/controladores.js"
import { ConNoConciliacionMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, TablaDatos, ListaDesplegable } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class ConNoConciliacion extends Vista {
    constructor() {
        super("ConNoConciliacion")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Conciliación manual de transacciones")

        this.acciones.fechaI = new SolicitaDato()
            .setID("fechaI")
            .setTxtEtiqueta("Fecha Inicial")
            .setModoFecha()
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato()
            .setID("fechaF")
            .setTxtEtiqueta("Fecha Final")
            .setModoFecha()
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)

        this.acciones.conciliar = new Botonera()
            .addBoton("conciliar")
            .setIDContenedor("conciliar")
            .setTexto("Guardar avance")
            .setClase("marcador")
            .setListener(this.controlador.conciliaManual)
            .habilitarBoton(false)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(this.controlador.exportaExcel, "Transacciones a Conciliar")
            .setActualizaResumen(this.controlador.resumenAvance)

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 4) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        this.datos.tabla.camposEspeciales = {
            fecha_creación: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Operación")
                    .setModoFecha()
                    .setEstilo1()
            },
            fecha_valor: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Valor")
                    .setModoFecha()
                    .setEstilo1()
            },
            monto: () => {
                return new SolicitaDato().setTxtEtiqueta("Monto").setEstilo1().setModoMoneda()
            },
            tipo: () => {
                return new ListaDesplegable()
                    .setTxtEtiqueta("Tipo Movimiento")
                    .setEstilo1()
                    .setOpciones([
                        { texto: "No Identificado", valor: "0" },
                        { texto: "Cargo", valor: "1" },
                        { texto: "Abono", valor: "2" }
                    ])
            }
        }

        return this
    }
}

export default ConNoConciliacion
