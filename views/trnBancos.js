import { FORMATOS_BBVA } from "../src/constantes.js"

import Componente from "../components/componente.js"
import SelPeriodo from "../components/selPeriodo.js"
import SelArchivo from "../components/selArchivo.js"
import Tabla from "../components/tabla.js"

class TrnBancos extends Componente {
    constructor() {
        super("div", { clase: "trnBancos" })
        return this.inicia()
    }

    inicia() {
        this.selPeriodo = new SelPeriodo()
        this.selArchivo = new SelArchivo({ formato: FORMATOS_BBVA })
        this.selLayout = new Componente("seleccion", { clase: "trnBnkLayout" })
        this.tabla = new Tabla()
        return this
    }

    configura() {
        this.selPeriodo.setEstilo2()

        this.selArchivo.btnSeleccionar.setListener("click", () => {
            const archivo = this.selArchivo.selArchivo.getComponente().files[0]

            const reader = new FileReader();
            reader.onload = (e) => {
                const contenido = e.target.result
                this.tabla.parseaTexto(contenido).actualizaTabla()
            }
            reader.readAsText(archivo)

            alert("Leyendo archivo...")
        })

        return this
    }

    crea() {
        this.addHijos([
            this.selPeriodo.mostrar(),
            this.selArchivo.mostrar(),
            this.tabla.mostrar()
        ])
        return this
    }

    mostrar() {
        return this
            .configura()
            .crea()
            .getComponente()
    }
}

export default TrnBancos;