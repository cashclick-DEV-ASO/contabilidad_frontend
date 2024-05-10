import Vista from "./vista.js"
import { RegTrnBancosCtrl as Controlador } from "../controllers/controladores.js"
import { RegTrnBancosMdl as Modelo } from "../models/modelos.js"

import {
    Periodo,
    SolicitaArchivo,
    SolicitaDato,
    TablaDatos,
    ListaDesplegable,
    Botonera
} from "../components/componentes.js"
import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class RegTrnBancos extends Vista {
    constructor() {
        super("RegTrnBancos")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Registro de Transacciones Bancarias")

        this.acciones.selPeriodo = new Periodo().setID("periodo")

        this.acciones.selBanco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.selLayout = new ListaDesplegable()
            .setTxtEtiqueta("Layout")
            .setID("layout")
            .setListener(SYS.CHNG, this.controlador.cambioLayout)

        this.acciones.selArchivo = new SolicitaArchivo()
            .accionAbrir(this.controlador.leerArchivo)
            .accionSeleccionar(this.controlador.cambioArchivo, this.controlador.cambioArchivo)
            .setID("archivo")
            .setMensaje("Selecciona un Banco y un Layout.")

        this.acciones.guardar = new Botonera()
            .addBoton("btnGuardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setValidaModificacion(this.controlador.validaModificacion)

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
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 4) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteOrdenar = true
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        this.datos.tabla.camposEspeciales = {
            Fecha_Operación: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Operación")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            Fecha_Valor: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Valor")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            Monto: () => {
                return new SolicitaDato().setTxtEtiqueta("Monto").setEstilo1().setModoMoneda()
            },
            Tipo_Movimiento: () => {
                return new ListaDesplegable()
                    .setTxtEtiqueta("Tipo Movimiento")
                    .setEstilo1()
                    .setOpciones([
                        { texto: "No Identificado", valor: "0" },
                        { texto: "Cargo", valor: "1" },
                        { texto: "Abono", valor: "2" }
                    ])
            },
            Fecha_Creación: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Creación")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            Fecha_Pago: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Pago")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            "Fecha Captura": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Captura")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            "Fecha Operación": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Operación")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            }
        }

        this.controlador.cargaInicial()
        return this
    }
}

export default RegTrnBancos
