import Componente from "../components/componente.js"
// import logo from "../images/Cashclick_logo.svg"

const logo = new URL("../images/Cashclick_logo.svg", import.meta.url).href


class Inicio extends Componente {
    constructor() {
        super("section", { clase: "inicio" })
        return this.inicia()
    }

    inicia() {
        this.mensaje = new Componente("span", { clase: "msjBienvenida" })
        this.imagen = new Componente("img", { clase: "logo" })
        return this
    }

    configura() {
        this.mensaje.setTexto("Bienvenido al sistema de gestion contable integral.")

        this.imagen.setPropiedad("src", logo)
        this.imagen.setPropiedad("alt", "Logo Cashclick")
        return this
    }

    crea() {
        this.addHijos([
            this.mensaje.getComponente(),
            this.imagen.getComponente()
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

export default Inicio;