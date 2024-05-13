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
			¿Seguro que desea cerrar la sesión?
			</h1>
			<H3>
			Puede hacer clic en el botón para continuar o seleccionar otra opción del menú.
			</H3>
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
