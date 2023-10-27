import { leerCookie, escribirCookie } from "../src/utils.js"

import Componente from "../components/componente.js"
import Inicio from "../views/inicio.js"
import Bancos from "../views/trnBancos.js"
import DWH from "../views/trnDWH.js"

class VistaTemporal extends Componente {
    constructor() {
        super("section", { clase: "mambu" })
        this.setTexto("<h1>Vista en construcción.</h1>")
        return this
    }
    mostrar() {
        return this.getComponente()
    }
}

class OOPS extends Componente {
    constructor() {
        super("section", { clase: "OOPS" })
        this.setTexto("<h1>Oops....!</h1><p>Esta pagina no existe</p><small>ni existira =)</small><p>Por favor, regrese al inicio</p>")
        return this
    }
    mostrar() {
        return this.getComponente()
    }
}

/**
 * @class Main
 * @extends Componente
 * @description Componente que contiene el contenido principal de la página mostrada
 */
class Main extends Componente {
    constructor() {
        super("main", { clase: "main" })
        this.vistas = {
            Inicio,
            Bancos,
            DWH,
            Mambu: VistaTemporal,
            Conciliacion: VistaTemporal,
            ResConciliacion: VistaTemporal,
            RecInteres: VistaTemporal,
            Configuracion: VistaTemporal,
            OOPS
        }
        this.activa = new (this.vistas[leerCookie("vista")] ?? this.vistas.Inicio)()
        return this
    }

    /**
     * @param {string} contenido - Contenido a mostrar en el main
     * @description Configura un contenido para el main
     */
    setContenido(vista) {
        this.limpiar()
        this.activa = new (this.vistas[vista] || this.vistas.OOPS)()
        this.addHijo(this.activa.mostrar())
        escribirCookie("vista", vista)
    }

    /**
     * @description Remueve el contenido del main
     */
    limpiar() {
        this.activa.removeComponente()
    }

    /**
     * @description Crea el main
     */
    mostrar() {
        this.addHijo(this.activa.mostrar())
        return this.getComponente()
    }
}

export default Main;