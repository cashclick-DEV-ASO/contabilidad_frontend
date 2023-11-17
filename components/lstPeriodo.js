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
		this.titulo = new Componente(SYS.LBL, { id: LSTPERIODO.TITULO })
		this.titulo.setTexto(LSTPERIODO.TXTTITULO)

		this.lblAnioPeriodo = new Componente(SYS.LBL, { id: LSTPERIODO.LBLANIO })
		this.lblAnioPeriodo.setTexto(LSTPERIODO.A)
		this.txtAnioPeriodo = new Componente(SYS.IN, { id: LSTPERIODO.TXTANIO })

		this.lblMesPeriodo = new Componente(SYS.LBL, { id: LSTPERIODO.LBLMES })
		this.lblMesPeriodo.setTexto(LSTPERIODO.M)
		this.txtMesPeriodo = new Componente(SYS.IN, { id: LSTPERIODO.TXTMES })

		this.txtAnioPeriodo.setPropiedad("type", SYS.NMBR)
		this.txtAnioPeriodo.setPropiedad("min", LSTPERIODO.ANIO_MINIMO)
		this.txtAnioPeriodo.setPropiedad("max", this.periodoActual.anio)
		this.txtAnioPeriodo.setValor(this.periodoActual.anio)
		this.txtAnioPeriodo.setListener(SYS.CHNG, () => {
			if (this.txtAnioPeriodo.getValor() > this.periodoActual.anio)
				this.txtAnioPeriodo.setValor(this.periodoActual.anio)

			if (this.txtAnioPeriodo.getValor() < ANIO_MINIMO)
				this.txtAnioPeriodo.setValor(ANIO_MINIMO)

			if (this.txtAnioPeriodo.getValor() % 1 !== 0)
				this.txtAnioPeriodo.setValor(parseInt(this.txtAnioPeriodo.getValor()))
		})

		this.txtMesPeriodo.setPropiedad("type", SYS.NMBR)
		this.txtMesPeriodo.setPropiedad("min", 1)
		this.txtMesPeriodo.setPropiedad("max", 12)
		this.txtMesPeriodo.setValor(this.periodoActual.mes)
		this.txtMesPeriodo.setListener(SYS.CHNG, () => {
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

	ocultar() {
		this.removeComponente()
	}

	setEstilo(estilo) {
		this.setClase(estilo)
	}

	setEstilo1() {
		this.setEstilo(this.estilos.estilo1)
	}

	setEstilo2() {
		this.setEstilo(this.estilos.estilo2)
	}
}

export default LstPeriodo
