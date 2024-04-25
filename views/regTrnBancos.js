import Vista from "./vista.js"
import { RegTrnBancosCtrl as Controlador } from "../controllers/controladores.js"
import { RegTrnBancosMdl as Modelo } from "../models/modelos.js"

import {
    Periodo,
    SolicitaArchivo,
    TablaDatos,
    ListaDesplegable,
    Botonera
} from "../components/componentes.js"
import { SYS } from "../src/constantes.js"

export class RegTrnBancos extends Vista {
    constructor() {
        super("RegTrnBancos")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Registro de Transacciones Bancarias")

        this.acciones.selPeriodo = new Periodo().setID("periodo")

        this.acciones.selBanco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.selLayout = new ListaDesplegable()
            .setTxtEtiqueta("Layout")
            .setID("layout")
            .setListener(SYS.CHNG, this.controlador.cambioLayout)

        this.acciones.selArchivo = new SolicitaArchivo()
            .accionAbrir(this.controlador.leerArchivo)
            .accionSeleccionar(this.controlador.cambioArchivo, this.controlador.cambioArchivo)
            .setID("archivo")
            .setMensaje("Selecciona un Banco y un Layout.")

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.datos.tabla = new TablaDatos().setID("tabla")

        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteEditar = true
        this.datos.tabla.permiteExportar = false
        this.datos.tabla.permiteOrdenar = true
        this.datos.tabla.permiteAgregar = false
        this.datos.tabla.permiteEliminar = false
        this.datos.tabla.permiteModificar = true
        this.datos.tabla.mostrarNoFila = true

        this.controlador.cargaInicial()
        return this
    }
}

export default RegTrnBancos
