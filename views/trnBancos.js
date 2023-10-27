import { FORMATOS_BBVA } from "../src/constantes.js"

import Componente from "../components/componente.js"
import SelPeriodo from "../components/selPeriodo.js"
import SelArchivo from "../components/selArchivo.js"

class TrnBancos extends Componente {
    constructor() {
        super("div", { clase: "trnBancos" })
        return this
    }

    inicia() {
        this.selPeriodo = new SelPeriodo({ clase: "trnBnkPeriodo"})
        this.selArchivo = new SelArchivo({ clase: "trnBnkArchivo", formato: FORMATOS_BBVA })
        return this
    }

    configura() {
        this.selPeriodo.setEstilo2()

        return this
    }

    crea() {
        this.addHijos([
            this.selPeriodo.mostrar(),
            this.selArchivo.mostrar()
        ])
        return this
    }

    mostrar() {
        return this
            .inicia()
            .configura()
            .crea()
            .getComponente()
    }
}

export default TrnBancos;