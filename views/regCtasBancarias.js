import Vista from "./vista.js"
import { RegCtasBancariasCtrl as Controlador } from "../controllers/controladores.js"
import { RegCtasBancariasMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RegCtasBancarias extends Vista {
    constructor() {
        super("RegCtasBancarias")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Registro Cuentas Bancarias")

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.datos.cuenta = new SolicitaDato()
            .setID("cuenta")
            .setTxtEtiqueta("No. Cuenta")
            .setTxtPlaceholder("Número de cuenta")
            .setEstilo2()
            .habilitarInput(false)
            .setListener(SYS.KUP, this.controlador.modificacionCuenta)

        this.datos.confirmacion = new SolicitaDato()
            .setID("confirmacion")
            .setTxtEtiqueta("Confirmar No. Cuenta")
            .setTxtPlaceholder("Número de cuenta")
            .setEstilo2()
            .habilitarInput(false)
            .setListener(SYS.KUP, this.controlador.validarCuenta)

        this.datos.layout = new ListaDesplegable()
            .setTxtEtiqueta("Tipo de Layout")
            .setID("layout")
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioLayout)

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.controlador.cargaInicial()

        return this
    }
}

export default RegCtasBancarias
