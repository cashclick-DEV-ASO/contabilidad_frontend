import Vista from "./vista.js"
import { ConciliarCtrl as Controlador } from "../controllers/controladores.js"
import { ConciliarMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

export class Conciliar extends Vista {
    constructor() {
        super("Conciliar")
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

        this.datos.tabla = new TablaDatos()
            .setID("tabla")
            .setListenerExportar(this.controlador.exportaExcel.bind(this.controlador))
        this.datos.tabla.permiteFiltro = true
        this.datos.tabla.permiteExportar = true
        this.datos.tabla.permiteEditar = true

        return this
    }
}

export default Conciliar
