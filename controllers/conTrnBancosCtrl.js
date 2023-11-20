import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnBancosCtrl extends Controlador {
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
		this.datos.tabla.limpiar()
	}

	buscar = () => {
		const datos = {
			fechaI: this.acciones.fechaI.getValor(),
			fechaF: this.acciones.fechaF.getValor(),
			banco: this.banco,
		}

		this.modelo.buscarTransaccionesBancos(datos).then(res => {
			this.datos.tabla.limpiar()

			this.datos.tabla
				.parseaJSON(res.resultado.informacion.resultado, null, this.formatoTabla)
				.actualizaTabla()
		})
	}

	formatoTabla = () => {
		return {
			fecha_valor: dato => {
				return new Date(dato).toLocaleDateString()
			},
			fecha_creacion: dato => {
				return new Date(dato).toLocaleDateString()
			},
			monto: dato => {
				return dato.toLocaleString("es-MX", {
					style: "currency",
					currency: "MXN",
				})
			},
			tipo: dato => {
				const tipos = ["No Identificado", "Cargo", "Abono"]
				return tipos[dato]
			},
		}
	}
}

export default ConTrnBancosCtrl
