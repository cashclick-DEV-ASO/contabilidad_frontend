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
		super("div", { clase: "vista" })
		this.controlador = null

		this.contenedorTitulo = new Componente("section", { clase: "contenedorTitulo" })
		this.contenedorAcciones = new Componente("section", { clase: "contenedorAcciones" })
		this.contenedorDatos = new Componente("section", { clase: "contenedorDatos" })

		this.titulo = new Componente("h3", { clase: "tituloVista" })
		this.acciones = {}
		this.datos = {}
	}

	/**
	 * Configura la vista con el título, acciones y datos correspondientes.
	 * @returns {Vista} - La vista actualizada.
	 */
	configura() {
		this.contenedorTitulo.addHijo(this.titulo.mostrar())

		Object.keys(this.acciones).forEach(accion => {
			this.contenedorAcciones.addHijo(this.acciones[accion].mostrar())
		})

		Object.keys(this.datos).forEach(dato => {
			this.contenedorDatos.addHijo(this.datos[dato].mostrar())
		})

		this.addHijos([
			this.contenedorTitulo.mostrar(),
			this.contenedorAcciones.mostrar(),
			this.contenedorDatos.mostrar(),
		])

		return this
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
