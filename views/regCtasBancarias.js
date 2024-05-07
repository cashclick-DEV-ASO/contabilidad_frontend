import Vista from "./vista.js"
import { RegCtasBancariasCtrl as Controlador } from "../controllers/controladores.js"
import { RegCtasBancariasMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato } from "../components/componentes.js"

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
            .setEstilo4()
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.cuenta = new SolicitaDato()
            .setID("cuenta")
            .setTxtEtiqueta("No. Cuenta")
            .setTxtPlaceholder("Número de cuenta")
            .setEstilo4()
            .habilitarInput(false)
            .setListener(SYS.IN, this.controlador.modificacionCuenta)

        this.acciones.confirmacion = new SolicitaDato()
            .setID("confirmacion")
            .setTxtEtiqueta("Confirmar No. Cuenta")
            .setTxtPlaceholder("Número de cuenta")
            .setEstilo4()
            .habilitarInput(false)
            .setListener(SYS.IN, this.controlador.validarCuenta)

        this.acciones.saldo = new SolicitaDato()
            .setID("saldoInicial")
            .setTxtEtiqueta("Saldo Inicial")
            .setTxtPlaceholder("Saldo inicial")
            .setEstilo4()
            .habilitarInput(false)
            .setModoMoneda()
            .setListener(SYS.IN, this.controlador.validarSaldo)

        this.acciones.fecha = new SolicitaDato()
            .setTipo(SYS.DT)
            .setID("fecha")
            .setTxtEtiqueta("Fecha")
            .setValorFecha(new Date().toISOString().split("T")[0])
            .setEstilo4()
            .setPropiedad("min", "2020-01-01")
            .setPropiedad("max", new Date().toISOString().split("T")[0])
            .habilitarInput(false)
            .setListener(SYS.CHNG, this.controlador.validarFecha)

        this.acciones.comentarios = new SolicitaDato(SYS.TXTAREA)
            .setID("comentarios")
            .setTxtEtiqueta("Comentarios")
            .setTxtPlaceholder("Comentarios")
            .setEstilo1()
            .habilitarInput(false)
            .setTxtPlaceholder("Comentarios")

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setID("guardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.controlador.cargaInicial()

        return this
    }
}

export default RegCtasBancarias
