import { Componente } from "../components/componentes.js"

import Inicio from "./inicio.js"
import RegTrnBancos from "./regTrnBancos.js"
import Layout from "./layout.js"
import Logout from "./logout.js"
import RegAclaraciones from "./regAclaraciones.js"
import ConAclaraciones from "./conAclaraciones.js"
import Ajustes from "./ajustes.js"
import Cartera from "./cartera.js"
import Conciliacion from "./conciliacion.js"
import ConConciliacion from "./conConciliacion.js"
import ConNoConciliacion from "./conNoConciliacion.js"
import Conciliar from "./conciliar.js"
import ConCtasBancarias from "./conCtasBancarias.js"
import ConCtasContables from "./conCtasContables.js"
import ConSaldos from "./conSaldos.js"
import ConTrnBancos from "./conTrnBancos.js"
import ConTrnMambu from "./conTrnMambu.js"
import EdoCta from "./edoCta.js"
import Etiquetas from "./etiquetas.js"
import NoConciliado from "./noConciliado.js"
import RecalculoCapital from "./recalculoCapital.js"
import RecalculoInteres from "./recalculoInteres.js"
import RegCtasBancarias from "./regCtasBancarias.js"
import RegCtasContables from "./regCtasContables.js"
import RegSaldos from "./regSaldos.js"
import RegTrnMambu from "./regTrnMambu.js"
import ResConciliacion from "./resConciliacion.js"
import ResSaldoFavor from "./resSaldoFavor.js"
import RegTrnDWH from "./regTrnDWH.js"
import ConTrnDWH from "./conTrnDWH.js"
import Variables from "./variables.js"
import RegUsuarios from "./regUsuarios.js"
import ConUsuarios from "./conUsuarios.js"
import ConTrnVirtual from "./conTrnVirtual.js"

class OOPS extends Componente {
    constructor() {
        super("section", { clase: "OOPS" })
        this.setTexto(
            "<h1>Oops....!</h1><p>Esta pagina no existe</p><small><small><small>ni existirá =)</small></small></small><p>Por favor, regrese al inicio</p>"
        )
        this.setPropiedad(
            "style",
            "width: 100%;height: 100%;text-align: center;font-weight: bold;inset: 0px;margin: auto;display: flex;align-items: center;justify-content: center;flex-direction: column;"
        )
        return this
    }

    mostrar() {
        return this.getComponente()
    }
}

const VISTAS = {
    Inicio,
    RegTrnBancos,
    Layout,
    Logout,
    OOPS,
    RegAclaraciones,
    ConAclaraciones,
    Ajustes,
    Cartera,
    Conciliacion,
    ConConciliacion,
    ConNoConciliacion,
    Conciliar,
    ConCtasBancarias,
    ConCtasContables,
    ConSaldos,
    ConTrnBancos,
    ConTrnMambu,
    EdoCta,
    Etiquetas,
    NoConciliado,
    RecalculoCapital,
    RecalculoInteres,
    RegCtasBancarias,
    RegCtasContables,
    RegSaldos,
    RegTrnMambu,
    ResConciliacion,
    ResSaldoFavor,
    RegTrnDWH,
    Variables,
    ConTrnDWH,
    RegUsuarios,
    ConUsuarios,
    ConTrnVirtual
}

export default VISTAS
