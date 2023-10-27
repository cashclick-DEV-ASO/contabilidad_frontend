import Componente from "../components/componente.js"

class TrnDWH extends Componente {
    constructor() {
        super("div", { clase: "trnDWH" })
        this.setTexto("<h1>Vista en construcción.</h1>")
        return this
    }

    mostrar() {
        return this.getComponente()
    }

}

export default TrnDWH;