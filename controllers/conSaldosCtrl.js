import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConSaldosCtrl extends Controlador {
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

	cambioBanco = () => {
		this.limpiaCampos()

		this.banco = this.bancos.find(
			banco => banco.valor === Number(this.acciones.banco.getValorSeleccionado())
		)

		if (this.banco === undefined)
			return this.msjError("No se encontró información del banco seleccionado.")

		this.llenaListaCtasContables(this.banco.valor).then(() => {
			if (this.ctasContables.length === 0)
				return this.msjError("No hay cuentas registradas para el banco seleccionado.")

			this.acciones.cuenta.actulizaOpciones(this.ctasContables)
		})
	}

	limpiaCampos = () => {
		this.datos.tabla.limpiar()
	}

	buscar = () => {
		this.msjInformacion("Buscando...")
	}
}

export default ConSaldosCtrl
