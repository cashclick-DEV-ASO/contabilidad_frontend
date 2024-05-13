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
            .setListener(this.controlador.buscar)

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.datos.noClnt = new SolicitaDato()
            .setTxtEtiqueta("No. de Cliente:")
            .setEstilo4()
            .setClase("dt")
            .setTxtPlaceholder("")
            .habilitarInput(false)

        this.datos.noCred = new SolicitaDato()
            .setTxtEtiqueta("No. de Crédito:")
            .setEstilo4()
            .setClase("dt")
            .setTxtPlaceholder("")
            .habilitarInput(false)

        this.datos.capital = new SolicitaDato()
            .setTxtEtiqueta("Monto del Crédito:")
            .setEstilo4()
            .setClase("dt")
            .setTxtPlaceholder("")
            .setModoMoneda()
            .habilitarInput(false)

        this.datos.interes = new SolicitaDato()
            .setTxtEtiqueta("Interés:")
            .setEstilo4()
            .setClase("dt")
            .setTxtPlaceholder("")
            .setModoMoneda()
            .habilitarInput(false)

        this.datos.fechaInicio = new SolicitaDato()
            .setTxtEtiqueta("Fecha de Inicio:")
            .setEstilo4()
            .setClase("dt")
            .setTxtPlaceholder("")
            .habilitarInput(false)

        this.datos.ultimoPago = new SolicitaDato()
            .setTxtEtiqueta("Fecha del Último Pago:")
            .setEstilo4()
            .setClase("dt")
            .setTxtPlaceholder("")
            .habilitarInput(false)

        this.datos.nota = new SolicitaDato(SYS.TXTAREA)
            .setTxtEtiqueta("Nota de Aclaración")
            .habilitarInput(false)
            .setClase("notas")
            .setTxtPlaceholder("Comentarios de seguimiento")

        return this
    }
}

export default RegAclaraciones
