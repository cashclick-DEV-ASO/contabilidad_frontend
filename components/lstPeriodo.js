import { SYS, LSTPERIODO } from "../src/constantes.js"

import { getPeridoActual } from "../src/utils.js"

import { Componente } from "./componentes.js"

/**
 * @class SelPeriodo
 * @extends Componente
 * @description Crea un componente para seleccionar el periodo
 */
export class LstPeriodo extends Componente {
	constructor() {
		super(SYS.SCTN, { id: LSTPERIODO.CONTENEDOR })
		this.periodoActual = getPeridoActual()
		this.estilos = {
			estilo1: LSTPERIODO.ESTILO_1,
			estilo2: LSTPERIODO.ESTILO_2,
		}

		return this.inicia()
	}

	inicia() {
		this.setEstilo1()
		this.titulo = new Componente(SYS.LBL, { id: LSTPERIODO.TITULO }).setTexto(
			LSTPERIODO.TXTTITULO
		)

		this.lblAnioPeriodo = new Componente(SYS.LBL, { id: LSTPERIODO.LBLANIO }).setTexto(
			LSTPERIODO.A
		)
		this.txtAnioPeriodo = new Componente(SYS.IN, { id: LSTPERIODO.TXTANIO })
			.setPropiedad("type", SYS.NMBR)
			.setPropiedad("min", LSTPERIODO.ANIO_MINIMO)
			.setPropiedad("max", this.periodoActual.anio)
			.setValor(this.periodoActual.anio)
			.setListener(SYS.CHNG, () => {
				if (this.txtAnioPeriodo.getValor() > this.periodoActual.anio)
					this.txtAnioPeriodo.setValor(this.periodoActual.anio)

				if (this.txtAnioPeriodo.getValor() < ANIO_MINIMO)
					this.txtAnioPeriodo.setValor(ANIO_MINIMO)

				if (this.txtAnioPeriodo.getValor() % 1 !== 0)
					this.txtAnioPeriodo.setValor(parseInt(this.txtAnioPeriodo.getValor()))
			})

		this.lblMesPeriodo = new Componente(SYS.LBL, { id: LSTPERIODO.LBLMES }).setTexto(
			LSTPERIODO.M
		)
		this.txtMesPeriodo = new Componente(SYS.IN, { id: LSTPERIODO.TXTMES })
			.setPropiedad("type", SYS.NMBR)
			.setPropiedad("min", 1)
			.setPropiedad("max", 12)
			.setValor(this.periodoActual.mes)
			.setListener(SYS.CHNG, () => {
				if (this.txtMesPeriodo.getValor() > 12) this.txtMesPeriodo.setValor(12)

				if (this.txtMesPeriodo.getValor() < 1) this.txtMesPeriodo.setValor(1)

				if (this.txtMesPeriodo.getValor() % 1 !== 0)
					this.txtMesPeriodo.setValor(parseInt(this.txtMesPeriodo.getValor()))
			})

		return this
	}

	configura() {
		this.addHijos([
			this.titulo.getComponente(),
			this.lblAnioPeriodo.getComponente(),
			this.txtAnioPeriodo.getComponente(),
			this.lblMesPeriodo.getComponente(),
			this.txtMesPeriodo.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	setEstilo(estilo) {
		this.setClase(estilo)
	}

	setEstilo1() {
		this.removeClase(this.estilos.estilo2)
		this.setEstilo(this.estilos.estilo1)
	}

	setEstilo2() {
		this.removeClase(this.estilos.estilo1)
		this.setEstilo(this.estilos.estilo2)
	}
}

export default LstPeriodo
