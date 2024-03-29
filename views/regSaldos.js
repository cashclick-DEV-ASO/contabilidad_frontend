import Vista from "./vista.js"
import { RegSaldosCtrl as Controlador } from "../controllers/controladores.js"
import { RegSaldosMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

const REG_SALDOS = {
    CONTENEDOR: "RegSaldos",
    TITULO: "Registro de Saldos Contables"
}

export class RegSaldos extends Vista {
    constructor() {
        super(REG_SALDOS.CONTENEDOR)
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(REG_SALDOS.TITULO)

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

        this.acciones.fecha = new SolicitaDato()
            .setID("fecha")
            .setTipo("date")
            .setTxtEtiqueta("Fecha")
            .setPropiedad("max", new Date().toISOString().split("T")[0])
            .setPropiedad("min", "2020-01-01")
            .setValorFecha(new Date())
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.validaModificacion)

        this.acciones.inicial = new SolicitaDato()
            .setID("saldoI")
            .setTxtEtiqueta("Saldo Inicial")
            .setTxtPlaceholder("$1,000,000.00")
            .setEstilo2()
            .setListener(SYS.BLR, () =>
                this.controlador.formatoMoneda(this.acciones.inicial.dato.getComponente(), true)
            )
            .setListener(SYS.KUP, () =>
                this.controlador.formatoMoneda(this.acciones.inicial.dato.getComponente())
            )
            .setListener(SYS.CHNG, this.controlador.validaModificacion)

        this.acciones.final = new SolicitaDato()
            .setID("saldoF")
            .setTxtEtiqueta("Saldo Final")
            .setTxtPlaceholder("$1,000,000.00")
            .setEstilo2()
            .setListener(SYS.BLR, () =>
                this.controlador.formatoMoneda(this.acciones.final.dato.getComponente(), true)
            )
            .setListener(SYS.KUP, () =>
                this.controlador.formatoMoneda(this.acciones.final.dato.getComponente())
            )
            .setListener(SYS.CHNG, this.controlador.validaModificacion)

        this.acciones.guardar = new Botonera()
            .addBoton("guardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.verificarDatos)

        this.controlador.cargaInicial()

        return this
    }
}

export default RegSaldos
