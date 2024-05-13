import Vista from "./vista.js"
import { ConConciliacionCtrl as Controlador } from "../controllers/controladores.js"
import { ConConciliacionMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, TablaDatos, ListaDesplegable } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class ConConciliacion extends Vista {
    constructor() {
        super("ConConciliacion")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta transacciones conciliadas")

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

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(this.controlador.exportaExcel, "Transacciones Conciliadas")
            .setEliminaBaseDatos(this.controlador.eliminar)

        this.datos.tabla.txtTtlEditar = "Transacciones conciliadas"
        this.datos.tabla.txtEliEditar = "Deshacer correspondencia"

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = true
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
            origen: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Origen")
                    .setEstilo1()
                    .habilitarInput(false)
            },
            credito: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Crédito")
                    .setEstilo1()
                    .habilitarInput(false)
            },
            fecha_valor: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Valor")
                    .setModoFecha()
                    .setEstilo1()
                    .habilitarInput(false)
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
                    .setBloquear(true)
            },
            monto: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Monto")
                    .setEstilo1()
                    .setModoMoneda()
                    .habilitarInput(false)
            },
            correspondencia: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Correspondencia")
                    .setEstilo1()
                    .habilitarInput(false)
            }
        }

        return this
    }
}

export default ConConciliacion
