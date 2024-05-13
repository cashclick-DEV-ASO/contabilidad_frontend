import Vista from "./vista.js"
import { ConTrnVirtualCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnVirtualMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const CON_TRN_MAMBU = {
    CONTENEDOR: "ConTrnVirtual",
    TITULO: "Consulta de Transacciones Virtuales"
}

export class ConTrnVirtual extends Vista {
    constructor() {
        super(CON_TRN_MAMBU.CONTENEDOR)
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(CON_TRN_MAMBU.TITULO)

        this.acciones.fechaI = new SolicitaDato()
            .setID("fechaI")
            .setTxtEtiqueta("Fecha Inicial")
            .setModoFecha()
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato()
            .setID("fechaF")
            .setModoFecha()
            .setTxtEtiqueta("Fecha Final")
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(this.controlador.exportaExcel, "Transacciones Mambu")
            .setModificaBaseDatos(this.controlador.modificar)
            .setEliminaBaseDatos(this.controlador.eliminar)

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = true
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
            fecha_registro: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Creación")
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
                    .setTxtEtiqueta("Tipo")
                    .setEstilo1()
                    .setOpciones([
                        { valor: 0, texto: "No Identificado" },
                        { valor: 1, texto: "Cargo" },
                        { valor: 2, texto: "Abono" }
                    ])
            }
        }

        return this
    }
}

export default ConTrnVirtual
