import Vista from "./vista.js"
import { RegTrnMambuCtrl as Controlador } from "../controllers/controladores.js"
import { RegTrnMambuMdl as Modelo } from "../models/modelos.js"

import {
    Botonera,
    Periodo,
    ListaDesplegable,
    SolicitaArchivo,
    TablaDatos
} from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const REG_TRN_MAMBU = {
    CONTENEDOR: "RegTrnMambu",
    TITULO: "Registro de Transacciones de Mambu"
}

export class RegTrnMambu extends Vista {
    constructor() {
        super(REG_TRN_MAMBU.CONTENEDOR)
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(REG_TRN_MAMBU.TITULO)

        this.acciones.selPeriodo = new Periodo().setID("periodo")

        this.acciones.archivo = new SolicitaArchivo()
            .accionAbrir(this.controlador.leerArchivo)
            .accionSeleccionar(this.controlador.cambioArchivo)
            .setID("archivo")
            .habilitaSelector(true)
            .setFormato("xls,xlsx,xlsm,csv,txt")
            .setMensaje("Selecciona un archivo a importar.")
            .setListener(this.controlador.leerArchivo)

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.datos.tabla = new TablaDatos().setID("tabla")

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
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
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

        return this
    }
}

export default RegTrnMambu
