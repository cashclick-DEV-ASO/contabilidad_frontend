import { Componente } from "./componentes.js"

export class ListaDesplegable extends Componente {
	constructor(
		phVacio = "Sin opciones",
		phLleno = "Selecciona",
		mostrarPh = true
	) {
		super("select", { clase: "listaDesplegable" })
		this.txtPhVacio = phVacio
		this.txtPhLleno = phLleno
		this.mostrarPh = mostrarPh
		this.opciones = []

		return this.inicia()
	}

	inicia() {
		this.placeholder = new Componente("option")
		return this
	}

	configura() {
		if (this.mostrarPh) this.generaPlaceholder()

		return this
	}

	crea() {
		this.opciones.forEach(opcion => {
			this.addHijo(opcion.getComponente())
		})
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}

	generaPlaceholder() {
		this.placeholder.setTexto(
			this.opciones.length ? this.txtPhLleno : this.txtPhVacio
		)
		this.placeholder.setValor("default")
		this.placeholder.setPropiedad("disabled", true)
		this.placeholder.setPropiedad("selected", true)

		this.addHijo(this.placeholder.getComponente())

		return this
	}

	setPhVacio(placeholder) {
		this.txtPhVacio = placeholder
		return this
	}

	setPhLleno(placeholder) {
		this.txtPhLleno = placeholder
		return this
	}

	setOpcion(atributos) {
		const opcion = new Componente("option")
		opcion.setTexto(atributos.texto)

		if (atributos.valor) opcion.setValor(atributos.valor)

		this.opciones.push(opcion)
		return this
	}

	setOpciones(opciones) {
		opciones.forEach(opcion => {
			this.setOpcion(opcion)
		})

		return this
	}

	reinicia() {
		this.getComponente().value = "default"
		return this
	}

	limpiar() {
		this.opciones = []
		this.vaciar()
		this.generaPlaceholder()

		return this
	}

	getValorSeleccionado() {
		return this.getComponente().value
	}

	getTextoSeleccionado() {
		return this.getComponente().selectedOptions[0].textContent
	}

	getIndiceSeleccionado() {
		return this.getComponente().selectedIndex
	}

	setSeleccionByIndice(valor) {
		this.getComponente().selectedIndex = valor
		return this
	}

	setSeleccionByValor(valor) {
		this.getComponente().value = valor
		return this
	}

	setMostrarPh(mostrar) {
		this.mostrarPh = mostrar
		return this
	}
}
