import Vista from "./vista.js"
import { ConTrnMambuCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnMambuMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const CON_TRN_MAMBU = {
    CONTENEDOR: "ConTrnMambu",
    TITULO: "Consulta de Transacciones de Mambu"
}

export class ConTrnMambu extends Vista {
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
            .setListenerExportar(
                this.controlador.exportaExcel.bind(this.controlador),
                "Transacciones Mambu"
            )
            .setValidaModificacion(this.controlador.validaModificacion)
            .setModificaBaseDatos(this.controlador.modificar)
            .setEliminaBaseDatos(this.controlador.eliminar)
            .setInsertaBaseDatos(this.controlador.insertar)

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = true
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = true
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
            fecha_creación: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Fecha Creación")
                    .setModoFecha()
                    .setEstilo1()
            },
            fecha_valor: () => {
                return new SolicitaDato().setTxtEtiqueta("Fecha Valor").setModoFecha().setEstilo1()
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
            },
            banco: (agregar = false) => {
                let a = [{ texto: "Virtual", valor: "0" }]
                if (!agregar) a.push({ texto: "Mambu", valor: "1" })
                return new ListaDesplegable()
                    .setTxtEtiqueta("Banco")
                    .setEstilo1()
                    .setOpciones(a)
                    .setBloquear(true)
                    .setMostrarPh(false)
            }
        }

        return this
    }
}

export default ConTrnMambu
