import { Componente, ListaDesplegable, SolicitaDato, Botonera, MuestraDato } from "./componentes.js"

import { SYS, TABLA } from "../src/constantes.js"

export class TablaDatos extends Componente {
	constructor() {
		super(SYS.SCTN, { clase: TABLA.CONTENEDOR })
		this.encabezados = []
		this.filas = []
		this.filasTmp = []
		this.permiteFiltro = true
		this.permiteEditar = false
		this.permiteExportar = true
		this.permiteOrdenar = true
		this.muestraNoFila = true

		return this.inicia()
	}

	inicia() {
		this.controles = new Componente(SYS.SCTN, { clase: TABLA.CONTROLES })

		this.selColFiltro = new ListaDesplegable()
			.setTxtEtiqueta(TABLA.TXT_LBL_FILTRO)
			.setEstilo2()
			.setTxtPhLleno("Cualquier columna")
			.setBloquearPh(false)
			.setListener(SYS.CHNG, this.limpiarFiltro.bind(this))

		this.valorFiltro = new SolicitaDato()
			.setTipo(SYS.TXT)
			.setTxtEtiqueta(TABLA.TXT_LBL_PARAMETRO)
			.setTxtPlaceholder(TABLA.TXT_PH_FILTRO)
			.setEstilo2()
			.setListenerCambio(this.filtrar.bind(this), SYS.KUP)

		this.contenedorDetalles = new Componente(SYS.SCTN, {
			clase: TABLA.DETALLES,
		})

		this.contenedor = new Componente(SYS.SCTN, {
			clase: TABLA.TABLA,
		})

		this.tablaSinDatos()
		return this
	}

	configura() {
		this.botones = this.congifuraBotones()

		this.valorFiltro.habilitarInput(false)
		if (this.botones.getNumeroBotones() > 0)
			this.botones.habilitarBoton(false, TABLA.TXT_BTN_EXPORTAR)

		this.controles.addHijos([
			this.permiteFiltro ? this.selColFiltro.mostrar() : null,
			this.permiteFiltro ? this.valorFiltro.mostrar() : null,
			this.botones.getNumeroBotones() ? this.botones.mostrar() : null,
		])

		this.addHijos([
			this.controles.esPadre() ? this.controles.getComponente() : null,
			this.contenedorDetalles.getComponente(),
			this.contenedor.addHijo(this.tabla.getComponente()).getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	parseaJSON(datos = [], titulos = null, formatoEspecial = null) {
		this.encabezados = []
		this.filas = []

		if (!datos || typeof datos !== SYS.OBJ || datos.length === 0) return this

		if (this.muestraNoFila) datos = datos.map((d, i) => ({ No: i + 1, ...d }))

		if (titulos) {
			this.encabezados = Object.keys(titulos).forEach(key => {
				return titulos[key]
			})
		} else {
			this.encabezados = Object.keys(datos[0])
		}

		this.filas = datos.map(f =>
			this.encabezados.map(k => {
				if (formatoEspecial && formatoEspecial[k]) {
					if (formatoEspecial[k]) return formatoEspecial[k](f[k])
				}
				return f[k]
			})
		)

		return this
	}

	parseaTexto(texto, separador = "\t") {
		this.encabezados = []
		this.filas = []
		if (!texto || texto === "") return this

		const lineas = texto.split("\n")
		this.encabezados = lineas[0].split(separador)
		this.filas = lineas.slice(1).map(l => l.split(separador))

		return this
	}

	construirTabla(encabezados = this.encabezados, filas = this.filas) {
		this.tabla = new Componente(SYS.TBL, { clase: TABLA.ID_TABLA })
		const tblEncabezdos = new Componente(SYS.THD, {
			clase: TABLA.TBL_ENC,
		})
		const tblCuerpo = new Componente(SYS.TBD, { clase: TABLA.TBL_CUERPO })

		tblEncabezdos.addHijo(
			new Componente(SYS.TR, { clase: TABLA.TBL_FILA_HDR })
				.addHijos(
					encabezados.map(e => {
						const enc = new Componente(SYS.TH, { clase: TABLA.TBL_CELDA_HDR }).setTexto(
							this.limpiarTitulo(e)
						)

						if (this.permiteOrdenar) {
							enc.setListener(SYS.CLK, e =>
								this.ordenar.bind(this)(e, this.tabla.getComponente())
							)
						}

						return enc.getComponente()
					})
				)
				.getComponente()
		)

		tblCuerpo.addHijos(
			filas.map((f, i) => {
				const fila = new Componente(SYS.TR, { clase: TABLA.TBL_FILA, id: i + 1 }).addHijos(
					f.map(c => {
						const cld = new Componente(SYS.TD, { clase: TABLA.TBL_CELDA }).setTexto(c)

						cld.setClase(this.tipoDato(c))

						if (this.permiteEditar) {
							cld.setListener(SYS.DCLK, this.editar)
						}
						return cld.getComponente()
					})
				)

				return fila.getComponente()
			})
		)

		this.tabla.addHijos([tblEncabezdos.getComponente(), tblCuerpo.getComponente()])

		return this
	}

	tablaSinDatos() {
		this.tabla = new Componente(SYS.DIV, { clase: TABLA.SIN_DATOS })
		this.tabla.setTexto(TABLA.TXT_SIN_DATOS)
		this.tabla.setPropiedad("style", TABLA.ESTILO_SIN_DATOS)
		this.e

		return this
	}

	limpiar() {
		this.encabezados = []
		this.filas = []
		this.detalles = null
		this.formatoDetalles = null
		this.actualizaTabla()
		return this
	}

	actualizaTabla({ encabezados = this.encabezados, filas = this.filas, updtFiltro = true } = {}) {
		this.tabla.removeComponente()
		if (this.filas.length == 0) {
			this.tablaSinDatos()
			this.valorFiltro.habilitarInput(false)
			if (this.botones.getNumeroBotones() > 0)
				this.botones.habilitarBoton(false, TABLA.TXT_BTN_EXPORTAR)
		} else {
			this.construirTabla(encabezados, filas)
			this.valorFiltro.habilitarInput(true)
			if (this.botones.getNumeroBotones() > 0)
				this.botones.habilitarBoton(true, TABLA.TXT_BTN_EXPORTAR)
		}

		this.mostrarDetalles()
		this.contenedor.addHijo(this.tabla.getComponente())
		if (updtFiltro)
			this.selColFiltro.actulizaOpciones(
				this.encabezados.map((titulo, indice) => {
					return { valor: indice, texto: this.limpiarTitulo(titulo) }
				})
			)

		return this
	}

	eliminaFila(indice) {
		this.filas.splice(indice, 1)
		return this
	}

	agregaFila(fila, indice = this.filas.length) {
		this.filas.splice(indice, 0, fila)
		return this
	}

	getFila(indice) {
		return this.filas[indice]
	}

	filtrar() {
		if (this.filasTmp.length === 0) this.filasTmp = this.filas

		const col = this.selColFiltro.getValorSeleccionado()
		const filtro = this.valorFiltro.getValor()

		if (filtro === "") {
			this.filas = this.filasTmp
			this.filasTmp = []
		} else {
			if (col === SYS.DFLT) {
				this.filas = this.filasTmp.filter(f => {
					return f.some(c => {
						if (isNaN(c)) return c.toLowerCase().includes(filtro.toLowerCase())
						return c == filtro
					})
				})
			} else {
				this.filas = this.filasTmp.filter(f => {
					const valor = f[col]
					if (valor && isNaN(valor))
						return valor.toLowerCase().includes(filtro.toLowerCase())
					return valor == filtro
				})
			}
		}

		this.actualizaTabla({ updtFiltro: false })
		return this
	}

	limpiarFiltro() {
		if (this.filasTmp.length > 0) {
			this.filas = this.filasTmp
			this.filasTmp = []
		}

		this.valorFiltro.setValor("")
		this.actualizaTabla({ updtFiltro: false })
		return this
	}

	setDetalles(detalles, formatoDetalles = null) {
		this.detalles = detalles
		this.formatoDetalles = formatoDetalles
		return this
	}

	limpiarTitulo(titulo) {
		return titulo.replace(/_/g, " ")
	}

	mostrarDetalles() {
		this.contenedorDetalles.vaciar()
		if (!this.detalles) return this

		this.contenedorDetalles.addHijos(
			Object.keys(this.detalles).map(key => {
				const v =
					this.formatoDetalles && this.formatoDetalles[key]
						? this.formatoDetalles[key](this.detalles[key])
						: this.detalles[key]
				return new MuestraDato()
					.setTxtEtiqueta(`${this.limpiarTitulo(key)}:`)
					.setTxtDato(v)
					.mostrar()
			})
		)

		return this
	}

	congifuraBotones() {
		const btns = new Botonera().setIDContenedor(TABLA.PARAMETROS)

		if (this.permiteExportar && this.lstnrExportar) {
			btns.addBoton(TABLA.TXT_BTN_EXPORTAR)
				.setTexto(TABLA.TXT_BTN_EXPORTAR)
				.setListener(() => {
					this.lstnrExportar(this.tabla.getComponente())
				})
		}

		return btns
	}

	tipoDato(valor) {
		if (typeof valor === SYS.NMBR || !isNaN(valor)) return SYS.NMBR
		if (typeof valor === SYS.STRNG) {
			if (this.esFecha(valor)) return SYS.DT
			if (this.esMoneda(valor)) return SYS.MNY
		}
		return SYS.STRNG
	}

	ordenar(e, tabla) {
		const celda = e.target
		const indice = celda.cellIndex
		const filas = Array.from(tabla.rows).slice(1)

		if (celda.classList.contains(TABLA.ORDEN_DESC)) {
			celda.classList.remove(TABLA.ORDEN_DESC)
			filas.sort(this.ordenarDatos(indice))
		} else if (celda.classList.contains(TABLA.ORDEN_ASC)) {
			celda.classList.remove(TABLA.ORDEN_ASC)
			celda.classList.add(TABLA.ORDEN_DESC)
			filas.sort(this.ordenarDatos(indice, -1))
		} else {
			celda.classList.remove(TABLA.ORDEN_DESC)
			celda.classList.add(TABLA.ORDEN_ASC)
			filas.sort(this.ordenarDatos(indice, 1))
		}

		filas.forEach(f => tabla.appendChild(f))

		return this
	}

	ordenarDatos(indice, direccion = 0) {
		return (a, b) => {
			if (direccion === 0) {
				const aID = parseInt(a.id)
				const bID = parseInt(b.id)

				if (aID < bID) return -1
				if (aID > bID) return 1
				return 0
			}

			if (!a.cells[indice] || !b.cells[indice]) return 0
			const aValor = a.cells[indice].innerText || a.cells[indice].textContent
			const bValor = b.cells[indice].innerText || b.cells[indice].textContent

			const aClase = a.cells[indice].classList[1]
			const bClase = b.cells[indice].classList[1]

			if (aClase === SYS.MNY && bClase === SYS.MNY)
				return (this.monedaANumero(aValor) - this.monedaANumero(bValor)) * direccion

			if (aClase === SYS.NMBR && bClase === SYS.NMBR) return (aValor - bValor) * direccion

			if (aClase === SYS.DT && bClase === SYS.DT)
				return (new Date(aValor) - new Date(bValor)) * direccion

			return aValor.localeCompare(bValor) * direccion
		}
	}

	editar(evento) {
		const celda = evento.target
		celda.contentEditable = true
		celda.focus()

		celda.addEventListener("blur", () => {
			celda.contentEditable = false
		})
	}

	esFecha(valor) {
		const expresionesRegulares = [
			/\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-2021
			/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/2021
			/\b\d{4}-\d{1,2}-\d{1,2}\b/, // 2021-12-31
			/\b\d{4}\/\d{1,2}\/\d{1,2}\b/, // 2021/12/31
			/\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-21
			/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/21
			/\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-2021
			/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/2021
		]

		for (const regex of expresionesRegulares) {
			if (regex.test(valor)) return true
		}

		return false
	}

	esMoneda(valor) {
		const regexMoneda = /^\s*([$]?)\s*(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)\s*$/ // $1,234.56

		return regexMoneda.test(valor)
	}

	monedaANumero(valor) {
		const valorNumerico = valor.replace(/[^\d.]/g, "")
		const numero = parseFloat(valorNumerico)

		return isNaN(numero) ? null : numero
	}

	setListenerExportar(callback) {
		this.lstnrExportar = callback
		return this
	}

	getFilas() {
		return this.filas
	}

	csvToTabla(contenido) {
		if (contenido) {
			const filas = contenido.split("\n")

			// Crear la tabla
			this.tabla = new Componente(SYS.TBL, { clase: TABLA.ID_TABLA })
			const encabezado = new Componente(SYS.THD, { clase: TABLA.TBL_ENC })
			const cuerpo = new Componente(SYS.TBD, { clase: TABLA.TBL_CUERPO })

			// Crear encabezados
			const encabezados = filas[0].split(",")
			const encabezadoRow = new Componente(SYS.TR, { clase: TABLA.TBL_FILA_HDR })
			encabezados.forEach(encabezado => {
				const th = new Componente(SYS.TH, { clase: TABLA.TBL_CELDA_HDR }).setTexto(
					encabezado.trim()
				)

				if (this.permiteOrdenar) {
					th.setListener(SYS.CLK, e =>
						this.ordenar.bind(this)(e, this.tabla.getComponente())
					)
				}

				encabezadoRow.addHijo(th.getComponente())
			})
			encabezado.addHijo(encabezadoRow.getComponente())
			this.tabla.addHijo(encabezado.getComponente())

			// Crear filas de datos
			for (let i = 1; i < filas.length; i++) {
				const datos = filas[i].split(",")
				const fila = new Componente(SYS.TR, { clase: TABLA.TBL_FILA })
				datos.forEach(dato => {
					const td = new Componente(SYS.TD, { clase: TABLA.TBL_CELDA }).setTexto(
						dato.trim()
					)
					if (this.permiteEditar) {
						td.setListener(SYS.DCLK, this.editar)
					}
					fila.addHijo(td.getComponente())
				})
				cuerpo.addHijo(fila.getComponente())
			}

			this.tabla.addHijo(cuerpo.getComponente())
			if (this.tabla.esPadre()) {
				this.contenedor.vaciar()
				this.contenedor.addHijo(this.tabla.getComponente())
				this.selColFiltro.actulizaOpciones(
					encabezados.map((titulo, indice) => {
						return { valor: indice, texto: this.limpiarTitulo(titulo) }
					})
				)
				this.valorFiltro.habilitarInput(true)
			}
		}
	}
}

export default TablaDatos
