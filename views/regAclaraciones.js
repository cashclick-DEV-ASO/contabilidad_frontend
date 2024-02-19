import Vista from "./vista.js"
import { RegAclaracionesCtrl as Controlador } from "../controllers/controladores.js"
import { RegAclaracionesMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, MuestraDato } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class RegAclaraciones extends Vista {
    constructor() {
        super("RegAclaraciones")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Registro de Aclaraciones")

        this.acciones.credito = new SolicitaDato()
            .setID("credito")
            .setTxtEtiqueta("Crédito")
            .setTxtPlaceholder("Número de crédito")
            .setEstilo2()
            .setListener(SYS.KUP, this.controlador.validaModificacion)

        this.acciones.buscar = new Botonera()
            .addBoton("btnBuscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .habilitarBoton(false)
            .setListener(this.controlador.buscar)

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.datos.noClnt = new MuestraDato().setTxtEtiqueta("No. de Cliente:")

        this.datos.noCred = new MuestraDato().setTxtEtiqueta("No. de Crédito:")

        this.datos.montoCredito = new MuestraDato().setTxtEtiqueta("Monto del Crédito:")

        this.datos.interes = new MuestraDato().setTxtEtiqueta("Interés:")

        this.datos.estatus = new MuestraDato().setTxtEtiqueta("Estatus:")

        this.datos.fechaInicio = new MuestraDato().setTxtEtiqueta("Fecha de Inicio:")

        this.datos.fechaUltimoPago = new MuestraDato().setTxtEtiqueta("Fecha del Último Pago:")

        this.datos.diasAtraso = new MuestraDato().setTxtEtiqueta("Días de Atraso:")

        this.datos.nota = new SolicitaDato()
            .setTxtEtiqueta("Nota de Aclaración")
            .setTxtPlaceholder("Escribe detalles de seguimiento")
            .setEstilo1()
            .habilitarInput(false)

        return this
    }
}

export default RegAclaraciones
