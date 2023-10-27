import Componente from "../components/componente.js"

class SelArchivo extends Componente {
    constructor({ formato = ".txt", multiple = false} = {}) {
        super("section", { clase: "selArchivo" })
        this.formato = formato
        this.multiple = multiple
        return this
    }

    inicia() {
        this.selArchivo = new Componente("input", { id: "selArchivo" })
        this.btnSeleccionar = new Componente("button", { id: "btnSeleccionar" })
        return this
    }

    configura() {
        this.selArchivo.setPropiedad("type", "file")
        this.selArchivo.setPropiedad("accept", this.formato)
        this.selArchivo.setPropiedad("required", true)
        this.selArchivo.setPropiedad("multiple", this.multiple)

        this.btnSeleccionar.setTexto("Leer archivo")
        this.btnSeleccionar.setListener("click", () => alert(this.selArchivo.getValor()))
        return this
    }

    crear() {
        this.addHijos([
            this.selArchivo.getComponente(),
            this.btnSeleccionar.getComponente()
        ])
        return this
    }

    mostrar() {
        return this
            .inicia()
            .configura()
            .crear()
            .getComponente()
    }
}

export default SelArchivo;