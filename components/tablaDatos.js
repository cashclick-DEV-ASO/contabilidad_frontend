import {
    Componente,
    ListaDesplegable,
    SolicitaDato,
    Botonera,
    MuestraDato,
    Editor,
    Mensaje
} from "./componentes.js"
// prueba
import { SYS, TABLA } from "../src/constantes.js"
import Controlador from "../controllers/controlador.js"

export class TablaDatos extends Componente {
    constructor() {
        super(SYS.SCTN, { clase: TABLA.CONTENEDOR })
        this.encabezados = []
        this.filas = []
        this.filasTmp = []
        this.formatoEspecial = null
        this.permiteFiltro = true
        this.permiteOrdenar = true
        this.permiteExportar = true
        this.permiteAgregar = true
        this.permiteEliminar = true
        this.permiteEditar = true
        this.permiteModificar = true
        this.mostrarNoFila = true
        this.tiposInput = {
            string: SYS.TXT,
            number: SYS.NMBR,
            date: SYS.DT,
            currency: SYS.NMBR
        }
        this.validaModificacion = null
        this.datosOriginales = []
        this.tituloExcel = null
        this.camposEspeciales = {}
        return this.inicia()
    }

    inicia() {
        this.controles = new Componente(SYS.SCTN, { clase: TABLA.CONTROLES })

        this.selColFiltro = new ListaDesplegable()
            .setTxtEtiqueta(TABLA.TXT_LBL_FILTRO)
            .setEstilo2()
            .setTxtPhLleno("Cualquier columna")
            .setTxtPhVacio("Sin opciones")
            .setBloquearPh(false)
            .setListener(SYS.CHNG, this.limpiarFiltro.bind(this))

        this.valorFiltro = new SolicitaDato()
            .setTipo(SYS.TXT)
            .setTxtEtiqueta(TABLA.TXT_LBL_PARAMETRO)
            .setTxtPlaceholder(TABLA.TXT_PH_FILTRO)
            .setEstilo2()
            .setListenerCambio(this.filtrar.bind(this), SYS.KUP)

        this.contenedorDetalles = new Componente(SYS.SCTN, {
            clase: TABLA.DETALLES
        })

        this.contenedor = new Componente(SYS.SCTN, {
            clase: TABLA.TABLA
        })

        this.tablaSinDatos()
        return this
    }

    configura() {
        this.botones = this.congifuraBotones()

        this.valorFiltro.habilitarInput(false)
        if (this.botones.getNumeroBotones() > 0) {
            if (this.permiteExportar) this.botones.habilitarBoton(false, TABLA.BTN_EXPORTAR)
            if (this.permiteAgregar) this.botones.habilitarBoton(false, TABLA.BTN_AGREGAR)
        }

        this.controles.addHijos([
            this.permiteFiltro ? this.selColFiltro.mostrar() : null,
            this.permiteFiltro ? this.valorFiltro.mostrar() : null,
            this.botones.getNumeroBotones() ? this.botones.mostrar() : null
        ])

        this.addHijos([
            this.controles.esPadre() ? this.controles.getComponente() : null,
            this.contenedorDetalles.getComponente(),
            this.contenedor.addHijo(this.tabla.getComponente()).getComponente()
        ])
        return this
    }

    mostrar() {
        return this.configura().getComponente()
    }

    parseaJSON(datos = [], titulos = null, formatoEspecial = null, columnasOcultas = []) {
        this.formatoEspecial = formatoEspecial
        this.encabezados = []
        this.filas = []

        if (!datos || typeof datos !== SYS.OBJ || datos.length === 0) return this

        if (this.mostrarNoFila) datos = datos.map((d, i) => ({ No: i + 1, ...d }))

        if (titulos) {
            this.encabezados = Object.keys(titulos).forEach((key) => {
                if (columnasOcultas.includes(key)) return
                return titulos[key]
            })
        } else {
            this.datosOriginales = datos
            this.encabezados = Object.keys(datos[0]).filter((k) => !columnasOcultas.includes(k))
        }

        this.filas = datos.map((f) =>
            this.encabezados.map((k) => f[k]).filter((k) => !columnasOcultas.includes(k))
        )

        return this
    }

    parseaTexto(texto, separador = "\t") {
        this.encabezados = []
        this.filas = []
        if (!texto || texto === "") return this

        const lineas = texto.split("\n")
        this.encabezados = lineas[0].split(separador)
        this.filas = lineas.slice(1).map((l) => l.split(separador))

        return this
    }

    construirTabla(encabezados = this.encabezados, filas = this.filas) {
        this.tabla = new Componente(SYS.TBL, { clase: TABLA.ID_TABLA })
        const tblEncabezdos = new Componente(SYS.THD, {
            clase: TABLA.TBL_ENC
        })
        const tblCuerpo = new Componente(SYS.TBD, { clase: TABLA.TBL_CUERPO })

        tblEncabezdos.addHijo(
            new Componente(SYS.TR, { clase: TABLA.TBL_FILA_HDR })
                .addHijos(
                    encabezados.map((e) => {
                        const enc = new Componente(SYS.TH, { clase: TABLA.TBL_CELDA_HDR }).setTexto(
                            this.limpiarTitulo(e)
                        )

                        if (this.permiteOrdenar) {
                            enc.setListener(SYS.CLK, (e) =>
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
                    f.map((c, j) => {
                        let dato = c
                        if (this.formatoEspecial && this.formatoEspecial[this.encabezados[j]])
                            dato = this.formatoEspecial[this.encabezados[j]](c)

                        const cld = new Componente(SYS.TD, { clase: TABLA.TBL_CELDA }).setTexto(
                            dato
                        )

                        cld.setClase(this.tipoDato(dato))

                        if (this.permiteEditar) cld.setListener(SYS.DCLK, this.editar)
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
            if (this.botones.getNumeroBotones() > 0) {
                if (this.permiteExportar) this.botones.habilitarBoton(false, TABLA.BTN_EXPORTAR)
                if (this.permiteAgregar) this.botones.habilitarBoton(false, TABLA.BTN_AGREGAR)
            }
        } else {
            this.construirTabla(encabezados, filas)
            this.valorFiltro.habilitarInput(true)
            if (this.botones.getNumeroBotones() > 0) {
                if (this.permiteExportar) this.botones.habilitarBoton(true, TABLA.BTN_EXPORTAR)
                if (this.permiteAgregar) this.botones.habilitarBoton(true, TABLA.BTN_AGREGAR)
            }
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
                this.filas = this.filasTmp.filter((f) => {
                    return f.some((c) => {
                        if (isNaN(c)) return c.toLowerCase().includes(filtro.toLowerCase())
                        return c == filtro
                    })
                })
            } else {
                this.filas = this.filasTmp.filter((f) => {
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
        return this.capitalizar(titulo.replace(/_/g, " "))
    }

    capitalizar(cadena) {
        const articulos = ["de", "el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o"]

        const palabras = cadena.split(" ")
        const palabrasCapitalizadas = palabras.map((palabra) => {
            if (palabra.length > 0) {
                const palabraMinuscula = palabra.toLowerCase()
                return articulos.includes(palabraMinuscula)
                    ? palabra
                    : palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
            } else {
                return palabra
            }
        })

        const resultado = palabrasCapitalizadas.join(" ")

        return resultado
    }

    mostrarDetalles() {
        this.contenedorDetalles.vaciar()
        if (!this.detalles) return this

        this.contenedorDetalles.addHijos(
            Object.keys(this.detalles).map((key) => {
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
        const btns = new Botonera().setIDContenedor(TABLA.PARAMETROS).setEstilo2()

        if (this.permiteExportar && this.lstnrExportar) {
            btns.addBoton(TABLA.BTN_EXPORTAR)
                .setTexto(TABLA.TXT_BTN_EXPORTAR, TABLA.BTN_EXPORTAR)
                .setListener(() => {
                    this.lstnrExportar(this.tabla.getComponente(), this.tituloExcel)
                }, TABLA.BTN_EXPORTAR)
        }

        if (this.permiteAgregar) {
            btns.addBoton(TABLA.BTN_AGREGAR)
                .setTexto(TABLA.TXT_BTN_AGREGAR, TABLA.BTN_AGREGAR)
                .setListener(() => {
                    const editor = new Editor()
                    editor.inicia().configura()
                    editor.txtTtl = "Datos Nueva Fila"
                    editor.txtModificar = "Agregar Fila"

                    this.encabezados.forEach((campo, indice) => {
                        if (this.mostrarNoFila && campo === "No") return
                        const datoEjemplo = this.filas.length > 0 ? this.filas[0][indice] : ""
                        const tipo = this.tiposInput[this.tipoDato(datoEjemplo)]
                        if (this.camposEspeciales[campo]) {
                            editor.campoEspecial(this.camposEspeciales[campo](true))
                            return
                        }

                        editor.addCampo(this.limpiarTitulo(campo), "", tipo)
                    })

                    editor.setAccionModificar((cerrar) => {
                        const campos = editor.getCampos()

                        if (this.insertaBaseDatos) {
                            const datos = {}
                            const newDatos = campos.map((campo) => {
                                if (campo instanceof ListaDesplegable)
                                    return campo.getValorSeleccionado()
                                return campo.getValor()
                            })

                            this.encabezados.forEach((campo, indice) => {
                                if (this.mostrarNoFila && indice === 0) return
                                let i = this.mostrarNoFila ? indice - 1 : indice
                                datos[campo] = newDatos[i]
                            })
                            if (this.validaModificacion && this.validaModificacion(datos)) return
                            this.insertaBaseDatos(datos)
                        } else {
                            const msjInfo = new Controlador().msjProcesando("Agregando fila...")
                            const datos = {}
                            const newDatos = campos.map((campo) => {
                                if (campo instanceof ListaDesplegable)
                                    return campo.getValorSeleccionado()
                                return campo.getValor()
                            })

                            this.encabezados.forEach((campo, indice) => {
                                if (this.mostrarNoFila && indice === 0) return
                                let i = this.mostrarNoFila ? indice - 1 : indice
                                datos[campo] = newDatos[i]
                            })
                            if (this.validaModificacion && this.validaModificacion(datos))
                                return msjInfo.ocultar()

                            if (this.mostrarNoFila) newDatos.unshift(this.filas.length + 1)
                            this.filas.push(newDatos)
                            this.actualizaTabla({ updtFiltro: false })
                            msjInfo.ocultar()
                            new Controlador().msjExito("Fila agregada correctamente.")
                        }
                        cerrar()
                    })

                    editor.mostrar()
                }, TABLA.BTN_AGREGAR)
        }

        return btns
    }

    tipoDato(valor) {
        if (valor === null || valor === undefined) return SYS.STRNG
        const fechaRegexes = [
            /^\d{1,2}\/\d{1,2}\/\d{2}$/, // dd/mm/yy
            /^\d{1,2}\/\d{1,2}\/\d{4}$/, // dd/mm/yyyy
            /^\d{4}-\d{2}-\d{2}$/, // yyyy-mm-dd
            /^\d{1,2}-\d{1,2}-\d{2}$/, // yy-mm-dd
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/ // "2023-08-20T06:00:00.000Z"
        ]

        if (
            typeof valor === SYS.OBJ ||
            (valor.length >= 6 && valor.includes("-") && valor.includes("/") && Date.parse(valor))
        )
            return SYS.DT

        if (typeof valor === SYS.NMBR || !isNaN(valor)) return SYS.NMBR

        if (typeof valor === SYS.STRNG) {
            for (const regex of fechaRegexes) {
                if (regex.test(valor)) return SYS.DT
            }

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

        filas.forEach((f) => tabla.appendChild(f))

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

            if (aClase === SYS.NMBR && bClase === SYS.NMBR) {
                if (this.esMoneda(aValor) && this.esMoneda(bValor))
                    return (this.monedaANumero(aValor) - this.monedaANumero(bValor)) * direccion

                return (aValor - bValor) * direccion
            }

            if (aClase === SYS.DT && bClase === SYS.DT && aValor && bValor) {
                const [diaA, mesA, anioA] = aValor.split("/")
                const fechaA = new Date(`${anioA}-${mesA - 1}-${diaA}`)

                const [diaB, mesB, anioB] = bValor.split("/")
                const fechaB = new Date(`${anioB}-${mesB - 1}-${diaB}`)

                return (new Date(fechaA) - new Date(fechaB)) * direccion
            }

            return aValor.localeCompare(bValor) * direccion
        }
    }

    ordenarDatosS(datos, condiciones) {
        return datos.sort((a, b) => {
            for (let i = 0; i < condiciones.length; i++) {
                let columna = condiciones[i].columna
                let desc = condiciones[i].desc
                if (a[columna] < b[columna]) return desc ? 1 : -1
                if (a[columna] > b[columna]) return desc ? -1 : 1
            }

            return 0
        })
    }

    editar = (evento) => {
        const celda = evento.target
        const editor = new Editor()
        editor.inicia().configura()

        this.encabezados.forEach((campo, indice) => {
            if (this.mostrarNoFila && campo === "No") return
            const datos = this.filas[celda.parentElement.rowIndex - 1]
            const tipo = this.tiposInput[this.tipoDato(datos[indice])]
            if (this.camposEspeciales[campo]) {
                editor.campoEspecial(this.camposEspeciales[campo](), datos[indice])
                return
            }

            editor.addCampo(this.limpiarTitulo(campo), datos[indice], tipo)
        })

        if (this.permiteModificar)
            editor.setAccionModificar((cerrar) => {
                const campos = editor.getCampos()

                if (this.modifcaBaseDatos) {
                    const datos = this.datosOriginales[celda.parentElement.rowIndex - 1]
                    const newDatos = campos.map((campo) => {
                        if (campo instanceof ListaDesplegable) return campo.getValorSeleccionado()
                        return campo.getValor()
                    })

                    this.encabezados.forEach((campo, indice) => {
                        if (this.mostrarNoFila && indice === 0) return
                        let i = this.mostrarNoFila ? indice - 1 : indice
                        if (datos.hasOwnProperty(campo)) datos[campo] = newDatos[i]
                    })
                    if (this.validaModificacion && this.validaModificacion(datos)) return
                    this.modifcaBaseDatos(datos)
                } else {
                    const msjInfo = new Controlador().msjProcesando("Actualizando fila...")
                    const campos = editor.getCampos()
                    const datos = {}
                    const newDatos = campos.map((campo) => {
                        if (campo instanceof ListaDesplegable) return campo.getValorSeleccionado()
                        return campo.getValor()
                    })

                    this.encabezados.forEach((campo, indice) => {
                        if (this.mostrarNoFila && indice === 0) return
                        let i = this.mostrarNoFila ? indice - 1 : indice
                        datos[campo] = newDatos[i]
                    })
                    if (this.validaModificacion && this.validaModificacion(datos))
                        return msjInfo.ocultar()

                    if (this.mostrarNoFila) newDatos.unshift(celda.parentElement.rowIndex)
                    this.filas[celda.parentElement.rowIndex - 1] = newDatos
                    this.actualizaTabla({ updtFiltro: false })
                    msjInfo.ocultar()
                    new Controlador().msjExito("Fila actualizada correctamente.")
                }
                cerrar()
            })

        if (this.permiteEliminar)
            editor.setAccionEliminar((cerrar) => {
                if (this.eliminaBaseDatos) {
                    const datos = this.datosOriginales[celda.parentElement.rowIndex - 1]
                    this.eliminaBaseDatos(datos)
                } else {
                    const msjInfo = new Controlador().msjProcesando("Eliminando fila...")
                    this.filas.splice(celda.parentElement.rowIndex - 1, 1)
                    this.actualizaTabla({ updtFiltro: false })
                    msjInfo.ocultar()
                    new Controlador().msjExito("Fila eliminada correctamente.")
                }
                cerrar()
            })

        editor.mostrar()
    }

    setInsertaBaseDatos(fnc) {
        this.insertaBaseDatos = fnc
        return this
    }

    setModificaBaseDatos(fnc) {
        this.modifcaBaseDatos = fnc
        return this
    }

    setEliminaBaseDatos(fnc) {
        this.eliminaBaseDatos = fnc
        return this
    }

    esFecha(valor) {
        if (valor.length > 10) return false

        const expresionesRegulares = [
            /\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-2021
            /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/2021
            /\b\d{4}-\d{1,2}-\d{1,2}\b/, // 2021-12-31
            /\b\d{4}\/\d{1,2}\/\d{1,2}\b/, // 2021/12/31
            /\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-21
            /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/21
            /\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-2021
            /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/ // 31/12/2021
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

    setListenerExportar(callback, titulo) {
        this.lstnrExportar = callback
        this.tituloExcel = titulo
        return this
    }

    getEncabezados() {
        return this.encabezados
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
            encabezados.forEach((encabezado) => {
                const th = new Componente(SYS.TH, { clase: TABLA.TBL_CELDA_HDR }).setTexto(
                    encabezado.trim()
                )

                if (this.permiteOrdenar) {
                    th.setListener(SYS.CLK, (e) =>
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
                datos.forEach((dato) => {
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

    setValidaModificacion(fnc) {
        this.validaModificacion = fnc
        return this
    }
}

export default TablaDatos
