import Mensaje from "../components/mensaje.js"

export class Controlador {
	constructor(vista = null, modelo = null) {
		this.mensaje = new Mensaje()
		this.vista = vista
		this.modelo = modelo
		this.bancos = []
		this.layouts = []
	}

	msjError(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.ERROR)
		this.mensaje.setCallback(callback)
		return this.mensaje.mostrar()
	}

	msjExito(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.EXITO)
		this.mensaje.setCallback(callback)
		return this.mensaje.mostrar()
	}

	msjAdvertencia(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.ADVERTENCIA)
		this.mensaje.setCallback(callback)
		return this.mensaje.mostrar()
	}

	msjInformacion(mensaje, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.INFORMACION)
		this.mensaje.setCallback(callback)
		return this.mensaje.mostrar()
	}

	msjSolicitar(mensaje, callback = null, placeholder = "Escriba su respuesta aquí") {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.SOLICITAR)
		this.mensaje.setCallback(callback)
		this.mensaje.setPlaceholder(placeholder)
		return this.mensaje.mostrar()
	}

	msjContinuar(
		mensaje = "Seguro desea continuar?",
		{
			txtSi = "Si",
			txtNo = "No",
			callbackSi = this.mensaje.respuestaTrue,
			callbackNo = this.mensaje.respuestaFalse,
		} = {}
	) {
		console.log(this.mensaje.respuesta)
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(this.mensaje.tipo.INFORMACION)
		this.mensaje.addBoton(txtSi, callbackSi)
		this.mensaje.addBoton(txtNo, callbackNo)
		this.mensaje.setCallback(callbackSi)
		this.mensaje.setCallback(callbackNo)
		return this.mensaje.mostrar()
	}

	msj(mensaje, tipo = this.mensaje.tipo.INFORMACION, callback = null) {
		this.mensaje.setMensaje(mensaje)
		this.mensaje.setTipo(tipo)
		this.mensaje.setCallback(callback)
		return this.mensaje.mostrar()
	}

	async llenaBanco(id = null) {
		await this.modelo.getBancos(id)

		if (this.modelo.success) {
			this.bancos = this.modelo.informacion.resultado

			this.vista.selBanco.selBanco
				.setOpciones(
					this.bancos.map(banco => {
						return { valor: banco.id, texto: banco.nombre }
					})
				)
				.mostrar()
		}
	}

	async llenaLayout(id = null) {
		await this.modelo.getLayouts(id)

		if (this.modelo.success) {
			this.layouts = this.modelo.informacion.resultado
			this.vista.selLayout.opciones = this.layouts.map(layout => {
				return { valor: layout.id, texto: layout.alias }
			})
			this.vista.selLayout.mostrar()
		}
	}
}

export default Controlador
