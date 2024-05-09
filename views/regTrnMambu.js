import Vista from "./vista.js"
import { RegTrnMambuCtrl as Controlador } from "../controllers/controladores.js"
import { RegTrnMambuMdl as Modelo } from "../models/modelos.js"

import {
    Botonera,
    Periodo,
    ListaDesplegable,
    SolicitaArchivo,
    SolicitaDato,
    TablaDatos
} from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const REG_TRN_MAMBU = {
    CONTENEDOR: "RegTrnMambu",
    TITULO: "Registro de Transacciones de Mambu"
}

export class RegTrnMambu extends Vista {
    constructor() {
        super(REG_TRN_MAMBU.CONTENEDOR)
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(REG_TRN_MAMBU.TITULO)

        this.acciones.selPeriodo = new Periodo().setID("periodo")

        this.acciones.archivo = new SolicitaArchivo()
            .accionAbrir(this.controlador.leerArchivo)
            .accionSeleccionar(this.controlador.cambioArchivo)
            .setID("archivo")
            .habilitaSelector(true)
            .setFormato("xls,xlsx,xlsm,csv,txt")
            .setMensaje("Selecciona un archivo a importar.")
            .setListener(this.controlador.leerArchivo)

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
            this.datos.tabla.permiteAgregar = true
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteFiltro = true
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
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
            "Fecha reporte": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha reporte")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            "Fecha de inicio del crédito": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha de inicio del crédito")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            "Monto Crédito": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Monto Crédito")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Fecha vencimiento del préstamo": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha vencimiento del préstamo")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
            },
            "Fecha programada de pago": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha programada de pago")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
            },
            "Fecha de pago": () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha de pago")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            "Importe Pago": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Importe Pago")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Capital pagado": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Capital pagado")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Interés pagado": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Interés pagado")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Iva interés pagado": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Iva interés pagado")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Interés moratorio pagado": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Interés moratorio pagado")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Iva interés moratorio pagado": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Iva interés moratorio pagado")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Cartera Vigente Total": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Cartera Vigente Total")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Cartera VencidaTotal": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Cartera VencidaTotal")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Cartera VencidaTotal": () => {
                return new SolicitaDato()
                    .setTxtEtiqueta("Cartera VencidaTotal")
                    .setEstilo1()
                    .setModoMoneda()
            },
            "Crédito Castigado": () => {
                return new ListaDesplegable()
                    .setTxtEtiqueta("Crédito Castigado")
                    .setEstilo1()
                    .setOpciones([
                        {
                            valor: "Si",
                            texto: "Si"
                        },
                        {
                            valor: "No",
                            texto: "No"
                        }
                    ])
            }
        }

        return this
    }
}

export default RegTrnMambu
