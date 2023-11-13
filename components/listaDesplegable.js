import { Componente } from "./componentes.js"

export class ListaDesplegable extends Componente {
	constructor(placeholder = "Selecciona") {
		super("select", { clase: "listaDesplegable" })
		this.txtPlaceholder = placeholder
		this.opciones = []

		return this.inicia()
	}
	inicia() {
		this.placeholder = new Componente("option")
		return this
	}

	configura() {
		this.placeholder.setTexto(this.txtPlaceholder)
		this.placeholder.setValor("default")
		this.placeholder.setPropiedad("disabled", true)
		this.placeholder.setPropiedad("selected", true)

		this.addHijo(this.placeholder.getComponente())

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

	setPlaceholder(placeholder) {
		this.txtPlaceholder = placeholder
		return this
	}

	setOpcion(atributos) {
		const opcion = new Componente(
			"option",
			atributos.id ? { id: atributos.id } : {}
		)
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
}
