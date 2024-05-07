import Vista from "./vista.js"
import { ConCtasBancariasCtrl as Controlador } from "../controllers/controladores.js"
import { ConCtasBancariasMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class ConCtasBancarias extends Vista {
    constructor() {
        super("ConCtasBancarias")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta de Cuentas Bancarias")

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setEstilo2()
            .setTxtPhLleno("Todos")
            .setBloquearPh(false)
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.consultar = new Botonera()
            .addBoton("btnConsultar")
            .setIDContenedor("consultar")
            .setTexto("Consultar")
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(
                this.controlador.exportaExcel.bind(this.controlador),
                "Cuentas Bancarias"
            )
            .setEliminaBaseDatos(this.controlador.eliminaTransaccion)
            .setModificaBaseDatos(this.controlador.modificaTransaccion)

        this.datos.tabla.mostrarNoFila = false

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = true
        }

        if (this.perfil == 4) {
            this.datos.tabla.permiteFiltro = false
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteOrdenar = false
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
        }

        this.controlador.cargaInicial()

        return this
    }
}

export default ConCtasBancarias
