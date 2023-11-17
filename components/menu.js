import { NAVEGACION, UL_MENU, LI_MENU, UL_SUBMENU, LI_SUBMENU } from "../src/constantes.js"

import { leerCookie, cerrarSesion } from "../src/utils.js"

import { Componente } from "./componentes.js"

/**
 * @class Menu
 * @extends Componente
 * @param {object} opciones - Objeto con la clase y el id para el nav
 * @description Componente para mostrar el menú de navegación
 */
export class Menu extends Componente {
	constructor() {
		super("nav", { id: NAVEGACION })
		this.rutas = JSON.parse(leerCookie("RUTAS"))
		this.main = null
		return this
	}

	crearRutas(rutas = this.rutas, subMenu = false, padre = this.getComponente()) {
		if (!rutas) return cerrarSesion()

		const ul = document.createElement("ul")
		ul.classList.add(subMenu ? UL_SUBMENU : UL_MENU)

		Object.keys(rutas).forEach(ruta => {
			const { titulo, vista } = rutas[ruta]

			const li = document.createElement("li")
			li.classList.add(subMenu ? LI_SUBMENU : LI_MENU)
			const span = document.createElement("span")
			span.textContent = titulo
			li.innerHTML = span.outerHTML
			ul.appendChild(li)

			if (typeof vista === "object") this.crearRutas(vista, true, li)
			else li.addEventListener("click", () => this.cambiarVista(vista))
		})

		padre.appendChild(ul)
	}

	cambiarVista(vista) {
		this.main.setContenido(vista)
	}

	setMain(main) {
		this.main = main
		return this
	}

	mostrar() {
		this.crearRutas()
		return this.getComponente()
	}
}

export default Menu
