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

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
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

export default ConSaldos
