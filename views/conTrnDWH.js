import Vista from "./vista.js"
import { ConTrnDWHCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnDWHMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

const CON_TRN_DWH = {
	CONTENEDOR: "ConTrnDWH",
	TITULO: "Consulta de Transacciones del DWH",
}

export class ConTrnDWH extends Vista {
	constructor() {
		super(CON_TRN_DWH.CONTENEDOR)
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto(CON_TRN_DWH.TITULO)

		this.acciones.fechaI = new SolicitaDato()
			.setID("fechaI")
			.setTipo("date")
			.setTxtEtiqueta("Fecha Inicial")
			.setValorFecha(new Date())
			.setListener(SYS.CHNG, this.controlador.cambiaFechaI)

		this.acciones.fechaF = new SolicitaDato()
			.setID("fechaF")
			.setTipo("date")
			.setTxtEtiqueta("Fecha Final")
			.setValorFecha(new Date())
			.setListener(SYS.CHNG, this.controlador.cambiaFechaF)

		this.acciones.banco = new ListaDesplegable()
			.setTxtEtiqueta("Banco")
			.setID("banco")
			.setTxtPhLleno("Todos")
			.setListener(SYS.CHNG, this.controlador.cambioBanco)
		this.acciones.banco.bloqueaPh = true

		this.acciones.buscar = new Botonera()
			.addBoton("buscar")
			.setIDContenedor("buscar")
			.setTexto("Buscar")
			.setListener(this.controlador.buscar)

		this.datos.tabla = new TablaDatos().setID("tabla")

		this.controlador.cargaInicial()
		this.datos.tabla.permiteFiltro = true
		this.datos.tabla.permiteExportar = true
		this.datos.tabla.permiteEditar = true

		return this
	}
}

export default ConTrnDWH
