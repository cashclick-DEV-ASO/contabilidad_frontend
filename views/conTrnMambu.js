import Vista from "./vista.js"
import { ConTrnMambuCtrl as Controlador } from "../controllers/controladores.js"
import { ConTrnMambuMdl as Modelo } from "../models/modelos.js"

import { Botonera, SolicitaDato, ListaDesplegable, TablaDatos } from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

const CON_TRN_MAMBU = {
	CONTENEDOR: "ConTrnMambu",
	TITULO: "Consulta de Transacciones de Mambu",
}

export class ConTrnMambu extends Vista {
	constructor() {
		super(CON_TRN_MAMBU.CONTENEDOR)
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto(CON_TRN_MAMBU.TITULO)

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

		this.datos.tabla = new TablaDatos().setID("tabla")
		this.datos.tabla.permiteFiltro = true
		this.datos.tabla.permiteExportar = true
		this.datos.tabla.permiteEditar = true

		return this
	}
}

export default ConTrnMambu
