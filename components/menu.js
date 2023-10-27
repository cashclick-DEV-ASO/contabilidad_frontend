import { RUTAS, NAVEGACION, UL_MENU, LI_MENU, UL_SUBMENU, LI_SUBMENU } from "../src/constantes.js"

import Componente from "../components/componente.js"

/**
 * @class Menu
 * @extends Componente
 * @param {object} opciones - Objeto con la clase y el id para el nav
 * @description Componente para mostrar el menú de navegación
 */
class Menu extends Componente {
    constructor() {
        super("nav", { clase: NAVEGACION })
        this.rutas = RUTAS
        this.main = null
        return this
    }

    crearRutas(rutas = this.rutas, subMenu = false, padre = this.getComponente()) {
        const ul = document.createElement("ul")
        ul.classList.add(subMenu ? UL_SUBMENU : UL_MENU)

        Object.keys(rutas).forEach(ruta => {
            const { visible, titulo, vista } = rutas[ruta]
            if (visible === false) return

            const li = document.createElement("li")
            li.classList.add(subMenu ? LI_SUBMENU : LI_MENU)
            li.innerHTML = titulo
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

