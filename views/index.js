import Componente from "../components/componente.js"
import Pie from "../components/pie.js"

class Index extends Componente{
    constructor(){
        super(document.createElement("div"), "contenido")
    }

    iniciaElementos(){
        this.pie = new Pie()
    }

    configuraElementos(){
        
    }

    integraElementos(){
        this.elemento.appendChild(this.pie.elemento)
    }

    crearElementos(){
        this.iniciaElementos()
        this.configuraElementos()
        this.integraElementos()
    }
}

export default Index;