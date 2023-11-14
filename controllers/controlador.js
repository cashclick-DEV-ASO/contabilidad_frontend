import Mensaje from "../components/mensaje.js"

export class Controlador {
	constructor(vista = null) {
		this.mensaje = new Mensaje()
		this.vista = vista
		this.listo = false
	}

	msjError(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.ERROR)
		this.mensaje.setCallback(callback)
		return this.mensaje
	}

	msjExito(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.EXITO)
		this.mensaje.setCallback(callback)
		return this.mensaje
	}

	msjAdvertencia(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.ADVERTENCIA)
		this.mensaje.setCallback(callback)
		return this.mensaje
	}

	msjInformacion(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.INFORMACION)
		this.mensaje.setCallback(callback)
		return this.mensaje
	}

	msj(mensaje, tipo = this.mensaje.tipo.INFORMACION, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(tipo)
		this.mensaje.setCallback(callback)
		return this.mensaje
	}
}

export default Controlador
