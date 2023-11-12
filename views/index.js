import { Componente, Menu, Main, Pie } from "../components/componentes.js"

export class Index extends Componente {
	constructor() {
		super(document.createDocumentFragment())
		return this.inicia()
	}

	inicia() {
		this.menu = new Menu()
		this.main = new Main()
		this.pie = new Pie()
		return this
	}

	configura() {
		this.menu.setMain(this.main)
		return this
	}

	crea() {
		this.addHijos([
			this.menu.mostrar(),
			this.main.mostrar(),
			this.pie.mostrar(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}
}

export default Index
