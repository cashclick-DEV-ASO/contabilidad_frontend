import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ResConciliacionCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    cargaInicial = () => {
        this.datos.noTrn.setTxtDato("45,456 (100%) - $ 5,435,256.52 (100%)")
        this.datos.noTrnOK.setTxtDato("236 (0.5%) - $ 685,353.68 (0.5%)")
        this.datos.noTrnNoOK.setTxtDato("45,220 (99.5%) - $ 4,749,902.84 (99.5%)")

        this.datos.noAbonos.setTxtDato("23,456 (100%)  -  $ 2,345,678.90 (100%)")
        this.datos.noAbonosOK.setTxtDato("123 (0.5%)  -  $ 234,567.89 (0.5%)")
        this.datos.noAbonosNoOK.setTxtDato("23,333 (99.5%)  -  $ 2,111,111.01 (99.5%)")

        this.datos.noCargos.setTxtDato("122,356 (100%)  -  $ 12,345,678.90 (100%)")
        this.datos.noCargosOK.setTxtDato("456 (0.5%)  -  $ 378,558.06 (0.5%)")
        this.datos.noCargosNoOK.setTxtDato("121,900 (99.5%)  -  $ 11,967,120.84 (99.5%)")
    }

    consultar = async () => {
        this.datos.noTrn.setValor("0 - $0.00")
        this.datos.noTrnOK.setValor("0 - $0.00")
        this.datos.noTrnNoOK.setValor("0 - $0.00")

        this.datos.noAbonos.setValor("0 - $0.00")
        this.datos.noAbonosOK.setValor("0 - $0.00")
        this.datos.noAbonosNoOK.setValor("0 - $0.00")

        this.datos.noCargos.setValor("0 - $0.00")
        this.datos.noCargosOK.setValor("0 - $0.00")
        this.datos.noCargosNoOK.setValor("0 - $0.00")

        this.msjError("No se encontró información para los periodos seleccionados.")
    }
}

export default ResConciliacionCtrl
