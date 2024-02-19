import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class CarteraCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    cargaInicial = () => {
        this.datos.noClnt.setTxtDato("1624 (100%)")
        this.datos.noClntOK.setTxtDato("423 (26%)")
        this.datos.noClntNoOK.setTxtDato("1201 (74%)")

        this.datos.noCreditos.setTxtDato("15436 (100%)")
        this.datos.noCreditosAct.setTxtDato("845 (5%)")
        this.datos.noCreditosLiq.setTxtDato("12445 (81%)")
        this.datos.noCreditosVen.setTxtDato("2146 (14%)")

        this.datos.carActiva.setTxtDato("$ 3,486,535.54")
        this.datos.carVencida.setTxtDato("$ 864,654.25")
    }

    consultar = async () => {
        this.datos.noClnt.setValor("0")
        this.datos.noClntOK.setValor("0")
        this.datos.noClntNoOK.setValor("0")

        this.datos.noCreditos.setValor("0")
        this.datos.noCreditosAct.setValor("0")
        this.datos.noCreditosLiq.setValor("0")
        this.datos.noCreditosVen.setValor("0")

        this.datos.carActiva.setValor("0")
        this.datos.carVencida.setValor("0")

        this.msjError("No se encontró información para los periodos seleccionados.")
    }
}

export default CarteraCtrl
