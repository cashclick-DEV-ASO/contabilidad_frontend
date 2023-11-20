import Controlador from "./controlador.js"

import { SYS, LAYOUT } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class LayoutCtrl extends Controlador {
	constructor(vista, modelo) {
		super(vista, modelo)
		this.acciones = this.vista.acciones
		this.datos = this.vista.datos
	}

	cargaInicial = () => {
		this.acciones.banco.setTemporalPH(LAYOUT.MSJ_CARGA_BANCOS)
		this.llenaListaBancos().then(() => {
			this.acciones.banco.actulizaOpciones(this.bancos)
		})
	}

	cambioBanco = async () => {
		this.limpiaCampos()
		this.acciones.layout.actulizaOpciones().setTemporalPH(LAYOUT.MSJ_CARGA_LAYOUTS).mostrar()

		this.banco = this.bancos.find(
			banco => banco.valor === Number(this.acciones.banco.getValorSeleccionado())
		)

		if (this.banco === undefined) {
			this.msjError(LAYOUT.MSJ_ERROR_BANCO_1)
			this.acciones.layout.actulizaOpciones([])
			return
		}

		this.llenaListaLayouts(this.banco.valor).then(() => {
			if (this.layouts.length === 0) {
				this.msjError(LAYOUT.MSJ_ERROR_LAYOUT_1)
				return
			}

			this.acciones.layout.actulizaOpciones(this.layouts)
		})
	}

	cambioLayout = () => {
		this.limpiaCampos({ lyt: false })

		this.layout = this.layouts.find(
			layout => layout.valor === Number(this.acciones.layout.getValorSeleccionado())
		)

		if (this.layout === undefined) {
			this.msjError(LAYOUT.MSJ_ERROR_LAYOUT_2)
			return
		}

		if (this.layout.extension === "") return this.msjError(LAYOUT.MSJ_ERROR_LAYOUT_3)

		this.acciones.extensiones.setValor(this.layout.extension)
		this.acciones.tipo.setSeleccionByValor(this.layout.tipo)
		try {
			this.datos.editor.setValor(JSON.stringify(JSON.parse(this.layout.layout), null, 4))
		} catch (error) {
			this.datos.editor.setValor(this.layout.layout)
			this.msjError(LAYOUT.MSJ_ERROR_LAYOUT_4)
		}

		this.acciones.guardar.habilitarBoton(true, LAYOUT.ID_BTN_ELIMINAR)
	}

	cambioTipo = () => {
		const tipo = this.acciones.tipo.getValorSeleccionado()
		const extensiones = LAYOUT.TIPOS.find(t => t.valor === tipo).extenciones
		this.acciones.extensiones.setValor(extensiones)
		this.informacionModificada()
	}

	informacionModificada = () => {
		const chek = () => {
			if (this.acciones.banco.dfltSelecciondo()) return false
			// if (!this.acciones.layout.dfltSelecciondo()) return false
			if (this.acciones.tipo.dfltSelecciondo()) return false
			if (this.acciones.extensiones.getValor() === "") return false
			if (this.datos.editor.getValor() === "") return false

			return true
		}

		this.acciones.guardar.habilitarBoton(chek(), LAYOUT.ID_BTN_GUARDAR)
	}

	limpiaCampos = ({ lyt = true, bnk = false } = {}) => {
		bnk && this.acciones.banco.reinicia()
		lyt && this.acciones.layout.reinicia()
		this.acciones.tipo.reinicia()
		this.acciones.extensiones.setValor("")
		this.acciones.guardar.habilitarBoton(false, LAYOUT.ID_BTN_GUARDAR)
		this.datos.editor.setValor("")
	}

	guardarCambios = async () => {
		try {
			JSON.parse(this.datos.editor.getValor())
		} catch (error) {
			this.msjError(LAYOUT.MSJ_ERROR_VALIDACION_FORMATO)
			return mostrarError(error)
		}

		const layout = this.layout
		layout.extension = this.acciones.extensiones.getValor()
		layout.layout = this.datos.editor.getValor()
		layout.tipo = this.acciones.tipo.getValorSeleccionado()

		await this.modelo.actualizaLayout(layout)

		if (this.modelo.resultado.success) {
			this.acciones.guardar.habilitarBoton(false, LAYOUT.ID_BTN_GUARDAR)
			this.acciones.layout.setValor(layout.id)
			this.msjExito(LAYOUT.MSJ_EXITO_GUARDADO)
			this.limpiaCampos({ bnk: true })
		} else {
			this.msjError(LAYOUT.MSJ_ERROR_GUARDADO)
		}
	}

	nuevoLayout = async (cerrar = null) => {
		if (this.mensaje.captura.getValor() === "") {
			this.msjError(LAYOUT.MSJ_ERROR_NUEVO_1)
			return
		}

		const layout = {
			id_banco: this.acciones.banco.getValorSeleccionado(),
			alias: this.mensaje.captura.getValor(),
			tipo: this.acciones.tipo.getValorSeleccionado(),
			extensiones: this.acciones.extensiones.getValor(),
			layout: this.datos.editor.getValor(),
		}

		await this.modelo.nuevoLayout(layout)

		if (this.modelo.resultado.success) {
			this.limpiaCampos({ bnk: true })
			this.acciones.layout.actulizaOpciones()
			this.msjExito(LAYOUT.MSJ_EXITO_NUEVO)
		} else {
			this.msjError(LAYOUT.MSJ_ERROR_NUEVO_2)
		}

		if (cerrar) cerrar()
	}

	validarNuevo = async () => {
		if (this.acciones.banco.dfltSelecciondo()) {
			this.msjError(LAYOUT.MSJ_ERROR_VALIDACION_BANCO)
			return
		}

		if (this.acciones.tipo.dfltSelecciondo()) {
			this.msjError(LAYOUT.MSJ_ERROR_VALIDACION_TIPO)
			return
		}

		if (this.acciones.extensiones.getValor() === "") {
			this.msjError(LAYOUT.MSJ_ERROR_VALIDACION_EXTENSION)
			return
		}

		if (this.datos.editor.getValor() === "") {
			this.msjError(LAYOUT.MSJ_ERROR_VALIDACION_EDITOR)
			return
		}

		try {
			JSON.parse(this.datos.editor.getValor())
		} catch (error) {
			const { lineaError, columnaError } = this.obtenLineaError(error)

			const lineaDetectada =
				lineaError && columnaError
					? `<br>Valide la línea ${lineaError} cerca del carácter ${columnaError}.`
					: ""

			this.msjError(`${LAYOUT.MSJ_ERROR_VALIDACION_FORMATO}${lineaDetectada}`)
			return mostrarError(error)
		}

		if (this.acciones.layout.getValorSeleccionado() !== this.acciones.layout.default) {
			this.msjContinuar(LAYOUT.MSJ_CONFIRMACION_NUEVO, {
				txtSi: LAYOUT.TXT_BTN_SI_CONFIRMACION_NUEVO,
				txtNo: LAYOUT.TXT_BTN_NO_CONFIRMACION_NUEVO,
				callbackSi: this.solictarAlias.bind(this),
				callbackNo: cerrar => {
					this.limpiaCampos.bind(this)({ lyt: true, bnk: true })
					cerrar()
				},
			})
			return
		}

		this.solictarAlias()
	}

	solictarAlias = (cerrar = null) => {
		this.mensaje = this.msjSolicitar(
			LAYOUT.MSJ_SOLICITUD_ALIAS,
			this.nuevoLayout.bind(this),
			LAYOUT.PH_ALIAS
		)
		if (cerrar) cerrar()
	}

	obtenLineaError = error => {
		const lineas = error.stack.split("\n")
		const linea = lineas[0].trim()
		const inicio = linea.indexOf("(") + 1
		const fin = linea.indexOf(")")
		const ruta = linea.substring(inicio, fin).split(" ")
		const lineaError = ruta[1]
		const columnaError = ruta[3]
		return { lineaError, columnaError }
	}

	elimiarLayout = async () => {
		this.msjContinuar(LAYOUT.MSJ_CONFIRMACION_ELIMINAR, {
			txtSi: LAYOUT.TXT_BTN_SI_CONFIRMACION_ELIMINAR,
			txtNo: LAYOUT.TXT_BTN_NO_CONFIRMACION_ELIMINAR,
			callbackSi: this.eliminar.bind(this),
		})
	}

	eliminar = async cerrar => {
		await this.modelo.eliminaLayout(this.layout.valor)

		if (this.modelo.resultado.success) {
			this.limpiaCampos({ bnk: true })
			this.acciones.layout.actulizaOpciones()
			this.msjExito(LAYOUT.MSJ_EXITO_ELIMINAR)
		} else {
			this.msjError(LAYOUT.MSJ_ERROR_ELIMINAR)
		}

		if (cerrar) cerrar()
	}
}

export default LayoutCtrl
