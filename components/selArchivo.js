import { Componente } from "./componentes.js"

export class SelArchivo extends Componente {
	constructor({ formato = ".txt", multiple = false } = {}) {
		super("section", { clase: "selArchivo" })
		this.formato = formato
		this.multiple = multiple
		this.ruta = null
		this.mensaje = "Seleccione un archivo.."

		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente("label", { id: "titulo" })
		this.lblArchivo = new Componente("label", { id: "lblArchivo" })
		this.lblRuta = new Componente("label", { id: "lblRuta" })
		this.selArchivo = new Componente("input", { id: "inpArchivo" })
		this.btnAbrir = new Componente("button", { id: "btnAbrir" })
		return this
	}

	configura() {
		this.titulo.setTexto("Archivo")
		this.lblRuta.setTexto(this.mensaje)

		this.lblArchivo.setTexto("Seleccionar")
		this.lblArchivo.setPropiedad("htmlFor", this.selArchivo.getID())
		this.lblArchivo.setClase("disabled")

		this.selArchivo.setListener("change", () => {
			if (this.formato.length === 0) {
				this.lblRuta.setTexto(
					"No se ha definido un formato válido para la selección de archivos."
				)
				this.btnAbrir.habilitar(false)
				this.lblArchivo.setClase("disabled")
				return
			}

			this.ruta = this.validarArchivo(
				this.selArchivo.getComponente().files[0],
				this.formato
			)
			if (this.ruta) {
				this.lblRuta.setTexto(this.ruta.name)
				this.btnAbrir.habilitar(true)
				return
			}
			this.lblRuta.setTexto("El archivo seleccionado no es válido")
			this.btnAbrir.habilitar(false)
		})

		this.selArchivo.setPropiedad("accept", this.formato)
		this.selArchivo.setPropiedad("type", "file")
		this.selArchivo.setPropiedad("required", true)
		this.selArchivo.setPropiedad("multiple", this.multiple)
		this.selArchivo.habilitar(false)

		this.btnAbrir.setTexto("Abrir")
		this.btnAbrir.habilitar(false)
		return this
	}

	crear() {
		this.addHijos([
			this.titulo.getComponente(),
			this.lblRuta.getComponente(),
			this.lblArchivo.getComponente(),
			this.selArchivo.getComponente(),
			this.btnAbrir.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crear().getComponente()
	}

	accionAbrir(accion) {
		const listener = e => {
			if (this.ruta) return accion(e)
			this.lblRuta.setTexto("Se debe seleccionar un archivo valido.")
		}

		this.btnAbrir.setListener("click", listener)
		return this
	}

	validarArchivo(archivo, formatos) {
		if (!archivo) return null

		const extension = archivo.name.split(".").pop()
		const formatosValidos = formatos
			.split(",")
			.map(formato => formato.replace(".", "").trim())

		return formatosValidos.includes(extension) ? archivo : null
	}

	setFormato(formato = []) {
		if (!formato) return this
		if (typeof formato === "string") formato = [formato]

		this.formato = formato
			.map(formato => {
				if (formato[0] !== ".") formato = "." + formato
				return `${formato}`
			})
			.join(",")

		this.selArchivo.setPropiedad("accept", this.formato)
		return this
	}

	habilitaSelector() {
		this.selArchivo.habilitar(true)
		this.lblArchivo.removeClase("disabled")
		return this
	}

	limpiar() {
		this.selArchivo.habilitar(false)
		this.lblArchivo.setClase("disabled")
		this.selArchivo.getComponente().value = ""
		this.lblRuta.setTexto(this.mensaje)
		this.btnAbrir.habilitar(false)
		return this
	}

	setMensaje(mensaje) {
		this.mensaje = mensaje
		this.lblRuta.setTexto(this.mensaje)
		return this
	}
}

export default SelArchivo
