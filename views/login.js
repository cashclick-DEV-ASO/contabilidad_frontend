import LoginController from "../controllers/login.js"

import Componente from "../components/componente.js"

import { leerCookie } from "../src/utils.js"
const LOGO = new URL("../images/Cashclick_logo_letras.svg", import.meta.url).href

/**
 * @class Login
 * @extends Componente
 * @description Vista para mostrar el fomulario de login
 */
export class Login extends Componente {
    constructor() {
        super("form", { clase: "formulario" })
        this.aplicarModo()
        this.controlador = new LoginController(this)
        return this.inicia()
    }

    inicia() {
        this.titulo = new Componente("label", { clase: "lblTitulo" }).setTexto("Inicio de sesión")

        this.imagen = new Componente("img", { clase: "logoLogin" })
            .setPropiedad("src", LOGO)
            .setPropiedad("alt", "Logo")

        this.usuario = new Componente("input", { clase: "inputLogin" }).setPropiedad(
            "placeholder",
            "Usuario"
        )

        this.password = new Componente("input", { clase: "inputLogin" })
            .setPropiedad("type", "password")
            .setPropiedad("placeholder", "Contraseña")

        this.btnLogin = new Componente("button", { clase: "btnLogin" }).setTexto("Iniciar sesión")

        this.gToken = new Componente("input", { clase: "inputLogin", id: "gToken" }).setPropiedad(
            "type",
            "hidden"
        )

        this.setListener("submit", this.controlador.login)

        this.addHijos([
            this.imagen.mostrar(),
            this.titulo.mostrar(),
            this.usuario.mostrar(),
            this.password.mostrar(),
            this.btnLogin.mostrar(),
            this.gToken.mostrar()
        ])
        return this
    }

    mostrar() {
        return this.getComponente()
    }

    aplicarModo() {
        const modo = leerCookie("MODO")
        const body = document.body
        body.classList.add(modo)
    }
}

export default Login
