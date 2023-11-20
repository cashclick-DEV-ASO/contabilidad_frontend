import { Componente, Menu, Main, Pie } from "../components/componentes.js"

import { leerCookie } from "../src/utils.js"

export class Index extends Componente {
	constructor() {
		super(document.createDocumentFragment())
		return this.inicia()
	}

	inicia() {
		this.menu = new Menu()

		this.main = new Main()
		this.menu.setMain(this.main)

		this.pie = new Pie()

		this.addHijos([this.menu.mostrar(), this.main.mostrar(), this.pie.mostrar()])
		return this
	}

	mostrar() {
		return this.getComponente()
	}
}

export default Index
