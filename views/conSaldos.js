import Vista from "./vista.js"
import { ConSaldosCtrl as Controlador } from "../controllers/controladores.js"
import { ConSaldosMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const CON_SALDOS = {
    CONTENEDOR: "ConSaldos",
    TITULO: "Consulta de Saldos Contables"
}

export class ConSaldos extends Vista {
    constructor() {
        super(CON_SALDOS.CONTENEDOR)
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(CON_SALDOS.TITULO)

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setTxtPhLleno("Todos")
            .setBloquearPh(false)
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.cuenta = new ListaDesplegable()
            .setTxtEtiqueta("Cuenta")
            .setID("cuenta")
            .setTxtPhLleno("Todas")
            .setBloquearPh(false)
            .setEstilo2()

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
            .setListenerExportar(
                this.controlador.exportaExcel.bind(this.controlador),
                "Saldos Contables"
            )
            .setValidaModificacion(this.controlador.validaModificacion)
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
            fecha: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha")
                    .setModoFecha()
                    .setEstilo1()
            },
            saldo_inicial: () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Saldo Inicial")
                    .setEstilo1()
                    .setModoMoneda()
            },
            saldo_final: () => {
                return new SolicitaDato().setTxtEtiqueta("Saldo Final").setEstilo1().setModoMoneda()
            }
        }

        this.controlador.cargaInicial()

        return this
    }
}

export default ConSaldos
