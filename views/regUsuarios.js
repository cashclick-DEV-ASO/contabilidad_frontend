import Vista from "./vista.js"
import { RegUsuariosCtrl as Controlador } from "../controllers/controladores.js"
import { RegUsuariosMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, SolicitaDato } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class RegUsuarios extends Vista {
    constructor() {
        super("RegUsuarios")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        let perfiles = []
        if (this.perfil == 1) {
            perfiles = [
                { valor: 1, texto: "Administrador" },
                { valor: 2, texto: "Director" },
                { valor: 3, texto: "Gerente" },
                { valor: 4, texto: "Analista" }
            ]
        }

        if (this.perfil == 2) {
            perfiles = [
                { valor: 3, texto: "Gerente" },
                { valor: 4, texto: "Analista" }
            ]
        }

        if (this.perfil == 3) {
            perfiles = [{ valor: 4, texto: "Analista" }]
        }

        this.titulo.setTexto("Registro de usuarios")

        this.acciones.nombre1 = new SolicitaDato()
            .setID("nombre1")
            .setTxtEtiqueta("Primer Nombre")
            .setTxtPlaceholder("Nombre")
            .setEstilo4()
            .setListener(SYS.IN, this.controlador.validaCampos)

        this.acciones.nombre2 = new SolicitaDato()
            .setID("nombre2")
            .setTxtEtiqueta("Segundo Nombre")
            .setTxtPlaceholder("Nombre")
            .setEstilo4()
            .setListener(SYS.IN, this.controlador.validaCampos)

        this.acciones.apellido1 = new SolicitaDato()
            .setID("apellido1")
            .setTxtEtiqueta("Primer Apellido")
            .setTxtPlaceholder("Apellido")
            .setEstilo4()
            .setListener(SYS.IN, this.controlador.validaCampos)

        this.acciones.apellido2 = new SolicitaDato()
            .setID("apellido2")
            .setTxtEtiqueta("Segundo Apellido")
            .setTxtPlaceholder("Apellido")
            .setEstilo4()
            .setListener(SYS.IN, this.controlador.validaCampos)

        this.acciones.correo = new SolicitaDato()
            .setID("correo")
            .setTxtEtiqueta("Correo")
            .setTxtPlaceholder("Correo electrónico")
            .setEstilo4()
            .setListener(SYS.IN, this.controlador.validaCampos)

        this.acciones.perfil = new ListaDesplegable()
            .setID("perfil")
            .setTxtEtiqueta("Perfil")
            .setEstilo4()
            .setOpciones(perfiles)
            .setListener(SYS.CHNG, this.controlador.validaCampos)

        this.acciones.password = new SolicitaDato()
            .setID("password")
            .setTipo(SYS.PASS)
            .setTxtEtiqueta("Contraseña")
            .setTxtPlaceholder("Contraseña temporal")
            .setEstilo4()
            .setListener(SYS.IN, this.controlador.validaCampos)

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setID("guardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        return this
    }
}

export default RegUsuarios
