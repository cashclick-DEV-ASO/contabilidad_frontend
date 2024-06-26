import Vista from "./vista.js"
import { LayoutCtrl as Controlador } from "../controllers/controladores.js"
import { LayoutMdl as Modelo } from "../models/modelos.js"

import { Botonera, Componente, ListaDesplegable, SolicitaDato } from "../components/componentes.js"

import { SYS, LAYOUT } from "../src/constantes.js"

export class Layout extends Vista {
    constructor() {
        super(LAYOUT.ID_VISTA)
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(LAYOUT.TITULO)

        this.acciones.nuevo = new Botonera()
            .setIDContenedor(LAYOUT.ID_CONTENEDOR_BTN_NUEVO)
            .addBoton(LAYOUT.ID_BTN_NUEVO)
            .setTexto(LAYOUT.TXT_BTN_NUEVO)
            .setListener(this.controlador.validarNuevo)

        this.acciones.banco = new ListaDesplegable()
            .setID(LAYOUT.ID_CONTENEDOR_BANCO)
            .setTxtEtiqueta(LAYOUT.TXT_ETQ_BANCO)
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.layout = new ListaDesplegable()
            .setID(LAYOUT.ID_CONTENEDOR_LAYOUT)
            .setTxtEtiqueta(LAYOUT.TXT_ETQ_LAYOUT)
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioLayout)

        this.acciones.tipo = new ListaDesplegable()
            .setID(LAYOUT.ID_CONTENEDOR_TIPO)
            .setTxtEtiqueta(LAYOUT.TXT_ETQ_TIPO)
            .setOpciones(LAYOUT.TIPOS)
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioTipo)

        this.acciones.extensiones = new SolicitaDato()
            .setID(LAYOUT.ID_CONTENEDOR_EXTENSIONES)
            .setTxtEtiqueta(LAYOUT.TXT_ETQ_EXTENSIONES)
            .setTxtPlaceholder(LAYOUT.PH_EXTENSIONES)
            .setEstilo2()
            .setTipo(SYS.TXT)
            .setListener(SYS.IN, this.controlador.informacionModificada)

        this.acciones.guardar = new Botonera()
            .setIDContenedor(LAYOUT.ID_CONTENEDOR_BTN_GUARDAR)
            .addBoton(LAYOUT.ID_BTN_GUARDAR)
            .setTexto(LAYOUT.TXT_BTN_GUARDAR)
            .setListener(this.controlador.guardar)
            .habilitarBoton(false)
            .addBoton(LAYOUT.ID_BTN_ELIMINAR)
            .setTexto(LAYOUT.TXT_BTN_ELIMINAR, LAYOUT.ID_BTN_ELIMINAR)
            .setListener(this.controlador.elimiarLayout, LAYOUT.ID_BTN_ELIMINAR)
            .habilitarBoton(false, LAYOUT.ID_BTN_ELIMINAR)
            .setEstilo2()

        this.datos.contenedorEditor = new Componente(SYS.SCTN, {
            clase: LAYOUT.ID_CONTENEDOR_EDITOR,
            hijos: [(this.datos.editor = new Componente("textarea", { clase: LAYOUT.ID_EDITOR }))]
        })

        this.datos.editor
            .setPropiedad("spellcheck", false)
            .setListener(SYS.IN, this.controlador.informacionModificada)

        this.controlador.cargaInicial()
        return this
    }
}

export default Layout
