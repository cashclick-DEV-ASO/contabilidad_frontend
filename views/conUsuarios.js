import Vista from "./vista.js"
import { ConUsuariosCtrl as Controlador } from "../controllers/controladores.js"
import { ConUsuariosMdl as Modelo } from "../models/modelos.js"

import { Botonera, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class RegUsuarios extends Vista {
    constructor() {
        super("ConUsuarios")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Consulta de Usuarios")

        this.acciones.actualizar = new Botonera()
            .addBoton("actualizar")
            .setIDContenedor("contenedorActualizar")
            .setTexto("Actualizar")
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setValidaModificacion(this.controlador.validaModificacion)
            .setModificaBaseDatos(this.controlador.modificaTransaccion)
            .setEliminaBaseDatos(this.controlador.eliminaTransaccion)

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 4) {
            this.datos.tabla.permiteFiltro = false
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteOrdenar = false
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = false
        }

        this.datos.tabla.camposEspeciales = {
            activo: new ListaDesplegable()
                .setTxtEtiqueta("Activo")
                .setEstilo1()
                .setOpciones([
                    { texto: "Si", valor: "1" },
                    { texto: "No", valor: "0" }
                ]),
            perfil: new ListaDesplegable()
                .setTxtEtiqueta("Perfil")
                .setEstilo1()
                .setOpciones([
                    { texto: "Administrador", valor: "1" },
                    { texto: "Director", valor: "2" },
                    { texto: "Gerente", valor: "3" },
                    { texto: "Analista", valor: "4" }
                ])
        }

        this.controlador.buscar()
        return this
    }
}

export default RegUsuarios
