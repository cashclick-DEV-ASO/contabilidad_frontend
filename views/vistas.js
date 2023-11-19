import { Componente } from "../components/componentes.js"

import Inicio from "./inicio.js"
import RegTrnBancos from "./regTrnBancos.js"
import Layout from "./layout.js"
import Logout from "./logout.js"
import Aclaraciones from "./aclaraciones.js"
import Ajustes from "./ajustes.js"

class OOPS extends Componente {
	constructor() {
		super("section", { clase: "OOPS" })
		this.setTexto(
			"<h1>Oops....!</h1><p>Esta pagina no existe</p><small><small><small>ni existirá =)</small></small></small><p>Por favor, regrese al inicio</p>"
		)
		this.setPropiedad(
			"style",
			"width: 100%;height: 100%;text-align: center;font-weight: bold;inset: 0px;margin: auto;display: flex;align-items: center;justify-content: center;flex-direction: column;"
		)
		return this
	}

	mostrar() {
		return this.getComponente()
	}
}

const VISTAS = {
	Inicio,
	RegTrnBancos,
	TrnDWH: VistaTemporal,
	TrnMambu: VistaTemporal,
	Layout,
	Logout,
	OOPS,
	Aclaraciones,
	Ajustes,
}

export default VISTAS
