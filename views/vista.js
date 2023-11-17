import Componente from "../components/componente.js"

/**
 * Clase Vista que representa una vista en la aplicación de contabilidad.
 * @class
 * @extends Componente
 * @property {Object} controlador - El controlador asociado a la vista.
 * @property {Componente} contenedorTitulo - El contenedor del título de la vista.
 * @property {Componente} contenedorAcciones - El contenedor de las acciones de la vista.
 * @property {Componente} contenedorDatos - El contenedor de los datos de la vista.
 * @property {Componente} titulo - El título de la vista.
 * @property {Object} acciones - Las acciones de la vista.
 * @property {Object} datos - Los datos de la vista.
 */
export class Vista extends Componente {
	/**
	 * Crea una nueva instancia de la clase Vista.
	 * @constructor
	 * @param {Object} controlador - El controlador asociado a la vista.
	 */
	constructor() {
		super("div", { id: "vista" })
		this.controlador = null

		this.contenedorTitulo = new Componente("section", { id: "contenedorTitulo" })
		this.contenedorAcciones = new Componente("section", { id: "contenedorAcciones" })
		this.contenedorDatos = new Componente("section", { id: "contenedorDatos" })

		this.titulo = new Componente("h3", { id: "tituloVista" })
		this.acciones = {}
		this.datos = {}
	}

	/**
	 * Configura la vista con el título, acciones y datos correspondientes.
	 * @returns {Vista} - La vista actualizada.
	 */
	configura() {
		this.agrupado = false
		this.contenedorTitulo.addHijo(this.titulo.mostrar())

		if (Object.keys(this.acciones).some(accion => this.acciones[accion].hijos))
			this.encubadora(this.acciones)

		if (Object.keys(this.datos).some(dato => this.datos[dato].hijos))
			this.encubadora(this.datos)

		Object.keys(this.acciones).forEach(accion => {
			if (!this.acciones[accion].hijo)
				this.contenedorAcciones.addHijo(this.acciones[accion].mostrar())
		})

		Object.keys(this.datos).forEach(dato => {
			if (!this.datos[dato].hijo) this.contenedorDatos.addHijo(this.datos[dato].mostrar())
		})

		this.addHijos([
			this.contenedorTitulo.mostrar(),
			this.contenedorAcciones.mostrar(),
			this.contenedorDatos.mostrar(),
		])

		return this
	}

	encubadora(lista) {
		const padres = Object.keys(lista).filter(elemento => lista[elemento].hijos)

		padres.forEach(padre => {
			lista[padre].hijos.forEach(hijo => {
				hijo.hijo = true
				lista[padre].addHijo(hijo.mostrar())
			})
		})
	}

	/**
	 * Muestra el componente configurado y creado.
	 * @returns {Componente} El componente creado.
	 */
	mostrar() {
		return this.configura().getComponente()
	}
}

export default Vista
