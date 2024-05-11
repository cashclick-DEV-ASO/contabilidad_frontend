import { NAVEGACION, UL_MENU, LI_MENU, UL_SUBMENU, LI_SUBMENU } from "../src/constantes.js"

import { leerCookie, cerrarSesion } from "../src/utils.js"
import Inicio from "../views/inicio.js"

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
        this.perfil = parseInt(leerCookie("CSHPERFIL"))
        this.rutas = this.aplicarPermisos(JSON.parse(leerCookie("RUTAS")))
        this.opcPrincipales = Object.keys(this.rutas).length
        this.main = null
        return this
    }

    crearRutas(rutas = this.rutas, subMenu = false, padre = this.getComponente()) {
        if (!rutas) return cerrarSesion()

        const ul = document.createElement("ul")
        ul.classList.add(subMenu ? UL_SUBMENU : UL_MENU)

        Object.keys(rutas).forEach((ruta) => {
            const { titulo, vista } = rutas[ruta]

            const li = document.createElement("li")
            li.classList.add(subMenu ? LI_SUBMENU : LI_MENU)
            li.addEventListener("mouseover", () => li.classList.add("miHover"))
            li.addEventListener("mouseout", () => li.classList.remove("miHover"))
            const span = document.createElement("span")
            span.textContent = titulo
            li.innerHTML = span.outerHTML
            ul.appendChild(li)

            if (typeof vista === "object") this.crearRutas(vista, true, li)
            else
                li.addEventListener("click", () => {
                    this.quitarHover()
                    this.cambiarVista(vista)
                })
        })

        padre.appendChild(ul)
    }

    quitarHover() {
        const lis = this.getComponente().querySelectorAll("li")
        lis.forEach((li) => li.classList.remove("miHover"))
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
        const a = this.getComponente().querySelector(".ulMenu")
        a.style.gridTemplateColumns = `repeat(${this.opcPrincipales}, minmax(0, 200px))`
        return this.getComponente()
    }

    aplicarPermisos(rutas) {
        let permisos = { inicio: true, logout: true }

        if (this.perfil === 1 || this.perfil === 2) permisos = this.permisos1()
        if (this.perfil === 3) permisos = this.permisos3()
        if (this.perfil === 4) permisos = this.permisos4()

        return this.filtrarMapa(rutas, permisos)
    }

    filtrarMapa(mapa, perfil) {
        const resultado = {}

        for (const clave in mapa) {
            if (perfil[clave]) {
                const valorMapa = mapa[clave]
                const valorPerfil = perfil[clave]

                if (typeof valorMapa === "object" && typeof valorPerfil === "object") {
                    const subMapa = this.filtrarMapa(valorMapa.vista, valorPerfil)
                    if (Object.keys(subMapa).length > 0) {
                        resultado[clave] = { ...valorMapa, vista: subMapa }
                    }
                } else {
                    resultado[clave] = valorMapa
                }
            }
        }

        return resultado
    }

    permisos1() {
        return {
            inicio: true,
            transacciones: {
                saldos: { registro: true, consulta: true },
                bancos: { registro: true, consulta: true },
                dwh: { registro: true, consulta: true },
                mambu: { registro: true, consulta: true },
                virtuales: true
            },
            conciliacion: {
                conciliar: true,
                consulta: true,
                noConciliado: true
            },
            reportes: {
                resConciliacion: true,
                saf: true,
                recalculoInteres: true,
                recalculoCapital: true,
                cartera: true,
                aclaraciones: { registro: true, consulta: true },
                ajustes: true,
                edoCta: true
            },
            administracion: {
                cuentasBancarias: { registro: true, consulta: true },
                cuentasContables: { registro: true, consulta: true },
                plantillas: { layout: true, Etiquetas: true },
                usuarios: { registro: true, consulta: true }
            },
            logout: true
        }
    }

    permisos3() {
        return {
            inicio: true,
            transacciones: {
                saldos: { registro: true, consulta: true },
                bancos: { registro: true, consulta: true },
                dwh: { registro: true, consulta: true },
                mambu: { registro: true, consulta: true },
                virtuales: true
            },
            conciliacion: {
                conciliar: true,
                consulta: true,
                noConciliado: true
            },
            reportes: {
                resConciliacion: false,
                saf: false,
                recalculoInteres: true,
                recalculoCapital: true,
                cartera: true,
                aclaraciones: { registro: true, consulta: true },
                ajustes: true,
                edoCta: true
            },
            administracion: {
                cuentasBancarias: { registro: true, consulta: true },
                cuentasContables: { registro: true, consulta: true },
                plantillas: { registro: false, consulta: false },
                usuarios: { registro: false, consulta: true }
            },
            logout: true
        }
    }

    permisos4() {
        return {
            inicio: true,
            transacciones: {
                saldos: { registro: false, consulta: false },
                bancos: { registro: true, consulta: true },
                dwh: { registro: true, consulta: true },
                mambu: { registro: true, consulta: true }
            },
            conciliacion: {
                conciliar: true,
                consulta: true,
                noConciliado: true
            },
            reportes: {
                resConciliacion: false,
                saf: false,
                recalculoInteres: false,
                recalculoCapital: false,
                cartera: false,
                aclaraciones: { registro: true, consulta: true },
                ajustes: false,
                edoCta: true
            },
            administracion: {
                cuentasBancarias: { registro: false, consulta: false },
                cuentasContables: { registro: false, consulta: false },
                plantillas: { registro: false, consulta: false },
                usuarios: { registro: false, consulta: false }
            },
            logout: true
        }
    }
}

export default Menu
