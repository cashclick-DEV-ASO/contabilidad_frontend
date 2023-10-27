class ViewTemplate extends Componente {
    constructor() {
        super(document.createElement("section"), "Clase")
        return this
    }

    iniciarElementos() {

    }

    configurarElementos() {

    }

    integrarElementos() {

    }

    crear() {
        this.iniciarElementos()
        this.configurarElementos()
        this.integrarElementos()
        return this
    }
}