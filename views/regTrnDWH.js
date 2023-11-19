import Vista from "./vista.js"
import { RegTrnDWHCtrl as Controlador } from "../controllers/controladores.js"
import { RegTrnDWHMdl as Modelo } from "../models/modelos.js"

import {
	Botonera,
	Periodo,
	ListaDesplegable,
	SolicitaArchivo,
	TablaDatos,
} from "../components/componentes.js"

import { SYS } from "../src/constantes.js"

const TRN_DWH = {
	CONTENEDOR: "TrnDWH",
	TITULO: "Registro de Transacciones DWH",
}

export class RegTrnDWH extends Vista {
	constructor() {
		super(TRN_DWH.CONTENEDOR)
		this.controlador = new Controlador(this, new Modelo())
		return this.inicia()
	}

	inicia() {
		this.titulo.setTexto(TRN_DWH.TITULO)

		this.acciones.selPeriodo = new Periodo().setID("periodo")

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
			.setDisabled(false)
			.setListener(this.controlador.guardar)

		this.datos.tabla = new TablaDatos().setID("tabla")
		this.datos.tabla.permiteFiltro = false
		this.datos.tabla.permiteExportar = false
		this.datos.tabla.permiteEditar = false

		return this
	}
}

export default RegTrnDWH
