import Mensaje from "../components/mensaje.js"

/**
 * Clase que representa el controlador de la aplicación.
 * @class
 * @property {Mensaje} mensaje - Objeto para mostrar mensajes en la vista.
 * @property {Object} vista - Objeto que representa la vista de la aplicación.
 * @property {Object} modelo - Objeto que representa el modelo de la aplicación.
 * @property {Array} bancos - Arreglo de bancos obtenidos del modelo.
 * @property {Array} layouts - Arreglo de layouts obtenidos del modelo.
 */
export class Controlador {
	/**
	 * Crea una instancia del controlador.
	 * @param {Object} vista - La vista asociada al controlador.
	 * @param {Object} modelo - El modelo asociado al controlador.
	 */
	constructor(vista, modelo) {
		this.mensaje = new Mensaje()
		this.vista = vista
		this.modelo = modelo
		this.bancos = []
		this.layouts = []
	}

	/**
	 * Muestra un mensaje en la interfaz de usuario.
	 * @param {string} mensaje - El mensaje a mostrar.
	 * @param {string} [tipo=this.mensaje.tipo.INFORMACION] - El tipo de mensaje (INFORMACION, ADVERTENCIA, ERROR).
	 * @param {function} [callback=null] - La función a llamar después de que se muestre el mensaje.
	 * @param {boolean} [mostrar=true] - Indica si se debe mostrar el mensaje o simplemente devolverlo.
	 * @returns {Mensaje|undefined} - El objeto Mensaje si se muestra el mensaje, o undefined si no se muestra.
	 */
	mostrarMensaje(mensaje, tipo = this.mensaje.tipo.INFORMACION, callback = null, mostrar = true) {
		const m = new Mensaje()
		m.setMensaje(mensaje)
		m.setTipo(tipo)
		m.setCallback(callback)
		return mostrar ? m.mostrar() : m
	}

	/**
	 * Muestra un mensaje de error.
	 * @param {string} mensaje - El mensaje de error a mostrar.
	 * @param {function} [callback=null] - Una función opcional que se ejecutará después de mostrar el mensaje.
	 * @returns {object} - El objeto que muestra el mensaje de error.
	 */
	msjError(mensaje, callback = null) {
		return this.mostrarMensaje(mensaje, this.mensaje.tipo.ERROR, callback)
	}

	/**
	 * Muestra un mensaje de éxito y llama a una función de retorno opcional.
	 * @param {string} mensaje - El mensaje a mostrar.
	 * @param {function} [callback=null] - La función de retorno opcional.
	 * @returns {any} El resultado de la función mostrarMensaje.
	 */
	msjExito(mensaje, callback = null) {
		return this.mostrarMensaje(mensaje, this.mensaje.tipo.EXITO, callback)
	}

	/**
	 * Muestra un mensaje de advertencia.
	 * @param {string} mensaje - El mensaje a mostrar.
	 * @param {function} [callback=null] - La función a llamar después de mostrar el mensaje.
	 * @returns {any} El resultado de la función mostrarMensaje.
	 */
	msjAdvertencia(mensaje, callback = null) {
		return this.mostrarMensaje(mensaje, this.mensaje.tipo.ADVERTENCIA, callback)
	}

	/**
	 * Muestra un mensaje de información.
	 * @param {string} mensaje - El mensaje a mostrar.
	 * @param {function} [callback=null] - Una función opcional a ejecutar después de mostrar el mensaje.
	 * @returns {any} El resultado de la función mostrarMensaje.
	 */
	msjInformacion(mensaje, callback = null) {
		return this.mostrarMensaje(mensaje, this.mensaje.tipo.INFORMACION, callback)
	}

	/**
	 * Muestra un mensaje de tipo "solicitar" con un mensaje y un campo de texto para que el usuario ingrese una respuesta.
	 * @param {string} mensaje - El mensaje a mostrar en el cuadro de diálogo.
	 * @param {function} [callback=null] - La función que se llamará cuando se presione el botón "Aceptar". Si no se proporciona, no se llamará ninguna función.
	 * @param {string} [placeholder="Escriba su respuesta aquí"] - El texto de marcador de posición para el campo de texto.
	 * @returns {Promise} - Una promesa que se resolverá con el valor ingresado por el usuario cuando se presione el botón "Aceptar".
	 */
	msjSolicitar(mensaje, callback = null, placeholder = "Escriba su respuesta aquí") {
		const m = this.mostrarMensaje(mensaje, this.mensaje.tipo.SOLICITAR, callback, false)
		m.setPlaceholder(placeholder)
		return m.mostrar()
	}

	/**
	 * Muestra un mensaje de confirmación con dos botones de opción y ejecuta la función correspondiente al botón presionado.
	 * @param {string} mensaje - El mensaje a mostrar en el cuadro de diálogo.
	 * @param {Object} opciones - Las opciones para personalizar el cuadro de diálogo.
	 * @param {string} opciones.txtSi - El texto del botón "Sí".
	 * @param {string} opciones.txtNo - El texto del botón "No".
	 * @param {function} opciones.callbackSi - La función a ejecutar cuando se presiona el botón "Sí".
	 * @param {function} opciones.callbackNo - La función a ejecutar cuando se presiona el botón "No".
	 * @returns {Promise<boolean>} - Una promesa que se resuelve en `true` si se presionó el botón "Sí", o en `false` si se presionó el botón "No".
	 */
	msjContinuar(
		mensaje = "Seguro desea continuar?",
		{
			txtSi = "Si",
			txtNo = "No",
			callbackSi = this.mensaje.respuestaTrue,
			callbackNo = this.mensaje.respuestaFalse,
		} = {}
	) {
		const m = new Mensaje()
		m.setMensaje(mensaje)
		m.setTipo(m.tipo.INFORMACION)
		m.addBoton(txtSi, callbackSi)
		m.addBoton(txtNo, callbackNo)
		m.setCallback(callbackSi)
		m.setCallback(callbackNo)
		return m.mostrar()
	}

	/**
	 * Llena la lista de bancos con las opciones obtenidas del modelo.
	 * @async
	 * @param {number|null} id - El id del banco a obtener, si es null se obtienen todos los bancos.
	 * @returns {Promise<void>}
	 */
	async llenaListaBancos(id = null) {
		await this.modelo.getBancos(id)

		this.bancos = this.llenaLista(this.vista.setOpcionesBanco.bind(this.vista), banco => ({
			valor: banco.id,
			texto: banco.nombre,
		}))
	}

	/**
	 * Llena la lista de layouts con las opciones obtenidas del modelo.
	 * @async
	 * @param {number|null} id - El id del layout a obtener, si es null se obtienen todos los layouts.
	 * @returns {Promise<void>}
	 */
	async llenaListaLayouts(id = null) {
		await this.modelo.getLayouts(id)

		this.layouts = this.llenaLista(this.vista.setOpcionesLayout.bind(this.vista), layout => ({
			valor: layout.id,
			texto: layout.alias,
		}))
	}

	/**
	 * Llena una lista con opciones obtenidas a partir de los registros del modelo.
	 * @param {function} agregaOpciones - Función que agrega las opciones a la lista.
	 * @param {function} extractor - Función que extrae la información necesaria de cada registro.
	 * @returns {Array} - Los registros obtenidos del modelo.
	 */
	llenaLista(agregaOpciones, extractor) {
		if (!this.modelo.resultado.success) return []

		const { informacion } = this.modelo.resultado
		const registros = informacion.resultado

		agregaOpciones(
			registros.map(registro => {
				return extractor(registro)
			})
		).mostrar()

		return registros
	}
}

export default Controlador
