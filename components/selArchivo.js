import Componente from "../components/componente.js"

class SelArchivo extends Componente {
    constructor({ formato = ".txt", multiple = false } = {}) {
        super("section", { clase: "selArchivo" })
        this.formato = formato
        this.multiple = multiple

        return this.inicia()
    }

    inicia() {
        this.titulo = new Componente("label", { id: "titulo" })
        this.lblArchivo = new Componente("label", { id: "lblArchivo" })
        this.lblRuta = new Componente("label", { id: "lblRuta" })
        this.selArchivo = new Componente("input", { id: "selArchivo" })
        this.btnSeleccionar = new Componente("button", { id: "btnSeleccionar" })
        return this
    }

    configura() {
        this.titulo.setTexto("Archivo")

        this.lblArchivo.setTexto("Seleccionar")
        this.lblArchivo.setPropiedad("htmlFor", this.selArchivo.getID())
        this.selArchivo.setListener("change", () => {
            console.log(this.selArchivo.getComponente().files[0].name);
            this.lblRuta.setTexto(this.selArchivo.getComponente().files[0].name)
        })

        this.selArchivo.setPropiedad("type", "file")
        this.selArchivo.setPropiedad("accept", this.formato)
        this.selArchivo.setPropiedad("required", true)
        this.selArchivo.setPropiedad("multiple", this.multiple)

        this.btnSeleccionar.setTexto("Abrir")
        return this
    }

    crear() {
        this.addHijos([
            this.titulo.getComponente(),
            this.lblRuta.getComponente(),
            this.lblArchivo.getComponente(),
            this.selArchivo.getComponente(),
            this.btnSeleccionar.getComponente()
        ])
        return this
    }

    mostrar() {
        return this
            .configura()
            .crear()
            .getComponente()
    }
}

export default SelArchivo;