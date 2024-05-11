import Vista from "./vista.js"
import { ConTrnBancosCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnBancosMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

const CON_TRN_BANCOS = {
    CONTENEDOR: "ConTrnBancos",
    TITULO: "Consulta de Transacciones Bancarias"
}

export class ConTrnBancos extends Vista {
    constructor() {
        super(CON_TRN_BANCOS.CONTENEDOR)
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto(CON_TRN_BANCOS.TITULO)

        this.acciones.fechaI = new SolicitaDato()
            .setID("fechaI")
            .setTxtEtiqueta("Fecha Inicial")
            .setModoFecha()
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato()
            .setID("fechaF")
            .setTxtEtiqueta("Fecha Final")
            .setModoFecha()
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.banco = new ListaDesplegable()
            .setTxtEtiqueta("Banco")
            .setID("banco")
            .setTxtPhLleno("Todos")
            .setBloquearPh(false)
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambioBanco)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .habilitarBoton(true)
            .setListener(this.controlador.buscar)

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(
                this.controlador.exportaExcel.bind(this.controlador),
                "Transacciones Bancarias"
            )
            .setValidaModificacion(this.controlador.validaModificacion)
            .setModificaBaseDatos(this.controlador.modificaTransaccion)
            .setEliminaBaseDatos(this.controlador.eliminaTransaccion)
            .setInsertaBaseDatos(this.controlador.insertaTransaccion)

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteEditar = true
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = true
            this.datos.tabla.permiteEliminar = true
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = true
            this.datos.tabla.permiteAgregar = true
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = true
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 4) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        this.datos.tabla.camposEspeciales = {
            fecha_creacion: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Operación")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            fecha_valor: () => {
                return new SolicitaDato()
                    .setTipo("date")
                    .setTxtEtiqueta("Fecha Valor")
                    .setEstilo1()
                    .setPropiedad("min", "2020-01-01")
                    .setPropiedad("max", new Date().toISOString().split("T")[0])
            },
            monto: () => {
                return new SolicitaDato().setTxtEtiqueta("Monto").setEstilo1().setModoMoneda()
            },
            tipo: () => {
                return new ListaDesplegable()
                    .setTxtEtiqueta("Tipo Movimiento")
                    .setEstilo1()
                    .setOpciones([
                        { texto: "No Identificado", valor: "0" },
                        { texto: "Cargo", valor: "1" },
                        { texto: "Abono", valor: "2" }
                    ])
            }
        }

        this.controlador.cargaInicial()

        return this
    }
}

export default ConTrnBancos
