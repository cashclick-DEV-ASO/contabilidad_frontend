import Vista from "./vista.js"
import { ConciliarCtrl as Controlador } from "../controllers/controladores.js"
import { ConciliarMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, TablaDatos, ListaDesplegable } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"
import { leerCookie } from "../src/utils.js"

export class Conciliar extends Vista {
    constructor() {
        super("Conciliar")
        this.perfil = leerCookie("CSHPERFIL")
        this.controlador = new Controlador(this, new Modelo())
        return this.inicia()
    }

    inicia() {
        this.titulo.setTexto("Generar conciliación bancaria automática")

        this.acciones.fechaI = new SolicitaDato()
            .setID("fechaI")
            .setTipo("date")
            .setTxtEtiqueta("Fecha Inicial")
            .setValorFecha(new Date())
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaI)

        this.acciones.fechaF = new SolicitaDato()
            .setID("fechaF")
            .setTipo("date")
            .setTxtEtiqueta("Fecha Final")
            .setValorFecha(new Date())
            .setEstilo2()
            .setListener(SYS.CHNG, this.controlador.cambiaFechaF)

        this.acciones.buscar = new Botonera()
            .addBoton("buscar")
            .setIDContenedor("buscar")
            .setTexto("Buscar")
            .setListener(this.controlador.buscar)

        this.acciones.concilia = new Botonera()
            .addBoton("conciliar")
            .setIDContenedor("conciliar")
            .setTexto("Conciliar")
            .habilitarBoton(false)
            .setListener(this.controlador.conciliar)

        this.acciones.guardar = new Botonera()
            .addBoton("guardar")
            .setIDContenedor("guardar")
            .setTexto("Guardar")
            .habilitarBoton(false)
            .setListener(this.controlador.guardar)

        this.datos.tabla = new TablaDatos().setID("tabla")

        if (this.perfil == 1 || this.perfil == 2) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
            this.datos.tabla.mostrarNoFila = true
        }

        if (this.perfil == 3) {
            this.datos.tabla.permiteEditar = false
            this.datos.tabla.permiteExportar = false
            this.datos.tabla.permiteAgregar = false
            this.datos.tabla.permiteEliminar = false
            this.datos.tabla.permiteModificar = false
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

        return this
    }
}

export default Conciliar
