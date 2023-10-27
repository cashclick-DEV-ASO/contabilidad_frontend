import Mensaje from "../components/mensaje.js"

class Controlador {
    constructor() {
        this.elementos = []
        this.listo = false
        this.mensaje = new Mensaje()
    }

    msjError(mensaje) {
        this.msj(mensaje, this.mensaje.tipos.error)
    }

    msjExito(mensaje) {
        this.msj(mensaje, this.mensaje.tipos.exito)
    }

    msjAdvertencia(mensaje) {
        this.msj(mensaje, this.mensaje.tipos.advertencia)
    }

    msjInformacion(mensaje) {
        this.msj(mensaje, this.mensaje.tipos.informacion)
    }

    msj(mensaje, tipo = mensaje.tipos.informacion) {
        const msj = new Mensaje()
        msj.setTipo(tipo)
            .setMensaje(mensaje)
            .mostrar()
    }
}

export default Controlador