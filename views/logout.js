import { Componente } from "../components/componentes.js"
import { SYS } from "../src/constantes.js"

import { cerrarSesion } from "../src/utils.js"

export class Logout extends Componente {
	constructor() {
		super(SYS.DIV, { id: "logout" })
		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente(SYS.SCTN, { id: "accion" })
		this.titulo.setTexto(
			`<h1>
			¿Seguro que desea salir?
			</h1>
			<br>
			<p>
			Es una pregunta muy difícil de responder. Tal vez tenga cosas importantes que hacer, o tal vez solo quiera escapar de esta aburrida sesión. No se preocupe, no me ofendo. Sé que soy solo un sistema de contabilidad más y que usted tiene una vida real.
			</p>
			<br>
			<p>
			Pero antes de que se vaya, permítame decirle algo: usted es una persona increíble y merece ser feliz. Así que, si decide salir, espero que encuentre lo que busca. Y si decide quedarse, espero que disfrute de mis funcionalidades.
			</p>
			<br>
			<p>
			Bueno, eso es todo. Ahora puede hacer clic en el botón de salir o seleccionar otra opción del menú. La decisión es suya. Solo recuerde que yo estaré aquí, esperando por usted.
			</p>
			<br>
			<span style="font-size: 2vh;">
			&#128522;
			</span>
			`
		)

		this.boton = new Componente(SYS.BTN, { id: "btnSalir" })
		this.boton.setTexto("Salir")
		this.boton.setListener(SYS.CLK, cerrarSesion)

		this.addHijos([this.titulo.mostrar(), this.boton.mostrar()])

		return this
	}

	mostrar() {
		return this.getComponente()
	}
}

export default Logout
