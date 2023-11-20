import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnDWHCtrl extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	cargaInicial = () => {
		this.acciones.banco.setTemporalPH("Cargando bancos...")
		this.llenaListaBancos().then(() => {
			this.acciones.banco.actulizaOpciones(this.bancos)
		})
	}

	cambiaFechaI = () => {
		if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
			this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
	}

	cambiaFechaF = () => {
		if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
			this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
	}

	cambioBanco = async () => {
		this.limpiaCampos()

		this.banco = this.bancos.find(
			banco => banco.valor === Number(this.acciones.selBanco.getValorSeleccionado())
		)
	}

	limpiaCampos = () => {
		this.datos.tabla.limpia()
	}

	buscar = () => {
		this.msjInformacion("Buscando...")
	}
}

export default ConTrnDWHCtrl
