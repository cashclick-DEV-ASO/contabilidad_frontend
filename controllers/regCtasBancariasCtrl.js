import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegCtasBancariasCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    cargaInicial = async () => {
        this.acciones.banco.setOpciones([
            { texto: "Banorte", valor: 1 },
            { texto: "BBVA", valor: 2 },
            { texto: "Santander", valor: 3 },
            { texto: "HSBC", valor: 4 },
            { texto: "Scotiabank", valor: 5 },
            { texto: "Banco Azteca", valor: 6 },
            { texto: "Inbursa", valor: 7 },
            { texto: "Banco del Bajío", valor: 8 },
            { texto: "Banco Mifel", valor: 9 },
            { texto: "Banco Forjadores", valor: 11 },
            { texto: "Banco Autofin", valor: 12 },
            { texto: "Banco Ve por Más", valor: 14 },
            { texto: "Banco Invex", valor: 15 },
            { texto: "Banco Monex", valor: 16 },
            { texto: "Banco Multiva", valor: 17 },
            { texto: "Banco Actinver", valor: 18 },
            { texto: "STP", valor: 19 }
        ])
    }

    guardar = async () => {
        if (
            this.datos.confirmacion.getValor() !== this.datos.cuenta.getValor() ||
            this.datos.layout.dfltSelecciondo()
        ) {
            this.msjError("Los números de cuenta no coinciden.")
            return
        }

        this.msjExito("Cuenta bancaria registrada exitosamente.")
    }

    cambioBanco = async () => {
        this.datos.cuenta.setValor("")
        this.datos.confirmacion.setValor("")
        this.datos.cuenta.habilitarInput(true)
        this.acciones.guardar.habilitarBoton(false)
        this.datos.layout.actulizaOpciones([])
    }

    modificacionCuenta = async () => {
        this.acciones.guardar.habilitarBoton(false)
        this.datos.confirmacion.setValor("")
        this.datos.confirmacion.habilitarInput(false)
        this.datos.layout.actulizaOpciones([])

        if (this.datos.cuenta.getValor().length > 5) {
            this.datos.confirmacion.habilitarInput(true)
        }
    }

    validarCuenta = async () => {
        if (this.datos.confirmacion.getValor().length < 5) {
            this.acciones.guardar.habilitarBoton(false)
            this.datos.layout.actulizaOpciones([])
            return
        }

        this.datos.layout.actulizaOpciones([
            { texto: "CSV", valor: 1 },
            { texto: "Texto", valor: 2 },
            { texto: "JSON", valor: 3 },
            { texto: "XML", valor: 4 }
        ])
    }

    cambioLayout = async () => {
        this.acciones.guardar.habilitarBoton(true)
    }
}

export default RegCtasBancariasCtrl
