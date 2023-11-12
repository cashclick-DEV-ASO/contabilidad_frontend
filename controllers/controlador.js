import Mensaje from "../components/mensaje.js"

export class Controlador {
	constructor() {
		this.elementos = []
		this.listo = false
		this.mensaje = new Mensaje()
	}

	msjError(mensaje) {
		this.msj(mensaje, this.mensaje.tipo.ERROR)
	}

	msjExito(mensaje) {
		this.msj(mensaje, this.mensaje.tipo.EXITO)
	}

	msjAdvertencia(mensaje) {
		this.msj(mensaje, this.mensaje.tipo.ADVERTENCIA)
	}

	msjInformacion(mensaje) {
		this.msj(mensaje, this.mensaje.tipo.INFORMACION)
	}

	msj(mensaje, tipo = this.mensaje.tipo.INFORMACION) {
		const msj = new Mensaje()
		msj.setTipo(tipo).setMensaje(mensaje).mostrar()
	}
}

export default Controlador
