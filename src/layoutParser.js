export const anchoBBVA = (texto, layout, cta) => {
    const lineas = texto.split("\n")
    const resultado = {
        success: false,
        mensaje: "",
        informacion: {},
        movimientos: [],
        lineaError: []
    }

    const idRegInfo = layout.apertura.idRegistro
    const camposInfo = layout.apertura.campos

    const idRegReg = layout.registros.idRegistro
    const camposReg = layout.registros.campos
    const tandemReg = layout.registros.tandem

    const idRegCierre = layout.cierre.idRegistro
    const camposCierre = layout.cierre.campos
    const tandemCierre = layout.cierre.tandem

    let unificado = []

    lineas.forEach((texto, linea) => {
        if (resultado.lineaError.length > 0) return
        const idRegistro = getIdentificador(texto, 0, 1)

        if (idRegistro === idRegInfo) {
            resultado.informacion.apertura = extraeCampos(texto, camposInfo)
            if (resultado.informacion.apertura.No_Cta != cta) {
                resultado.success = false
                resultado.mensaje = `El archivo no corresponde a la cuenta ${cta}.`
                resultado.lineaError.push([linea, texto])
            }
            unificado = []
            return
        }

        if (idRegistro === idRegReg) {
            const idMovimiento = getIdentificador(texto, tandemReg.inicio, tandemReg.espacios)
            unificado = evaluaTandem(idMovimiento, unificado, texto, tandemReg)
            if (unificado.length === 2) {
                resultado.movimientos.push(extraeCampos(unificado.join(""), camposReg))
                unificado = []
                return
            }
        }

        if (idRegistro === idRegCierre) {
            const idMovimiento = getIdentificador(texto, tandemCierre.inicio, tandemCierre.espacios)
            unificado = evaluaTandem(idMovimiento, unificado, texto, tandemCierre)
            if (unificado.length === 2) {
                resultado.informacion.cierre = extraeCampos(unificado.join(""), camposCierre)
                unificado = []
                return
            }
        }

        // resultado.success = false
        // resultado.mensaje =
        //     "El archivo tiene registros no contemplados en el layout.\nSe recomienda hacer una revisión manual."
        // resultado.lineaError.push([linea, texto])
    })

    if (resultado.lineaError.length > 0) return resultado

    resultado.success = true
    resultado.mensaje = "El archivo se leyó correctamente."
    return resultado
}

const getIdentificador = (texto, inicio, espacios) => {
    const valor = texto.substr(inicio, espacios)
    return Number(valor.trim())
}

const evaluaTandem = (idMovimiento, unificado, texto, tandem) => {
    if (idMovimiento === tandem.movimientounificado) {
        return [texto]
    }

    if (idMovimiento === tandem.detalle) {
        unificado.push(texto)
        return unificado
    }

    return [texto]
}

const extraeCampos = (texto, campos) => {
    const info = {}

    Object.keys(campos).forEach((campo) => {
        const { inicio, espacios, tipo } = campos[campo]
        const valor = extraeCampo(texto, inicio, espacios)
        info[campo] = convierte(valor, tipo)
    })

    return info
}

const extraeCampo = (texto, inicio, espacios) => {
    const valor = texto.substr(inicio, espacios)
    return valor.trim()
}

const convierte = (valor, tipo) => {
    if (tipo === "number") return Number(valor)
    if (tipo === "decimal") return Number(valor) / 100
    if (tipo === "date") {
        if (valor.length === 6) {
            const aa = valor.substr(0, 2)
            const mm = valor.substr(2, 2)
            const dd = valor.substr(4, 2)
            return new Date(`20${aa}`, parseInt(mm) - 1, dd)
        } else return new Date(valor)
    }
    return valor
}

export const delimitadoCONEKTA = (contenidoArchivo, layout) => {
    const lineas = contenidoArchivo.split("\n")
    const resultado = {
        success: false,
        mensaje: "",
        informacion: {},
        movimientos: [],
        lineaError: []
    }
    let encabezadosArchivo = []

    lineas.forEach((texto, linea) => {
        if (layout.encabezados && layout.encabezados == linea + 1) {
            encabezadosArchivo = texto.split(layout.delimitador)
            layout.columnas.forEach((columna) => {
                if (!encabezadosArchivo.includes(columna.nombre)) {
                    resultado.success = false
                    resultado.mensaje = `No se encontró la columna ${columna.nombre} en el archivo seleccionado.`
                    return resultado
                }
            })
            return
        }

        if (linea > layout.encabezados && encabezadosArchivo.length === 0) {
            resultado.success = false
            resultado.mensaje =
                "No se encontraron los encabezados del archivo en la línea esperada."
            return resultado
        }

        const c = texto.split(layout.delimitador)
        if (c.length === 0) return

        const campos = []
        for (var j = 0; j < c.length; j++) {
            if (c[j].charAt(0) === '"') {
                var campoCombinado = c[j]
                while (
                    campoCombinado.charAt(campoCombinado.length - 1) !== '"' ||
                    campoCombinado.length < 2
                ) {
                    j++
                    campoCombinado += "," + c[j]
                }
                c[j] = campoCombinado
            }
            campos.push(c[j])
        }

        const movimiento = {}
        layout.columnas.forEach((columna) => {
            const { nombre, tipo, posicion } = columna
            const valor = campos[posicion - 1]
            movimiento[nombre] = convertidorCONEKTA(valor, tipo)
        })

        resultado.movimientos.push(movimiento)
    })

    if (encabezadosArchivo.length === 0) {
        resultado.success = false
        resultado.mensaje = "No se encontraron los encabezados del archivo en la línea esperada."
        return resultado
    }

    resultado.success = true
    resultado.mensaje = "El archivo se leyó correctamente."
    return resultado
}

const convertidorCONEKTA = (valor, tipo) => {
    if (tipo === "number" || tipo === "decimal") return Number(valor)
    if (tipo === "date" && Date.parse(valor)) {
        valor = valor.replace(/([-+]\d{2})(\d{2})$/, "$1:$2")
        return new Date(valor)
    }
    return valor ? valor.trim() : ""
}

export const excelSTP = (contenidoArchivo, layout, cta) => {
    const resultado = {
        success: false,
        mensaje: "",
        informacion: {},
        movimientos: [],
        lineaError: []
    }

    const filas = XLSX.utils.sheet_to_json(contenidoArchivo, {
        range: layout.encabezados ? layout.encabezados - 1 : 0
    })

    if (filas[0]["Cuenta Liquidadora"] != cta) {
        resultado.success = false
        resultado.mensaje = `El archivo no corresponde a la cuenta ${cta}.`
        return resultado
    }

    try {
        filas.forEach((fila) => {
            const movimiento = {}
            layout.columnas.forEach((columna) => {
                const { nombre, tipo } = columna
                movimiento[nombre] = convertidorSTP(fila[nombre], tipo)
            })

            resultado.movimientos.push(movimiento)
        })

        resultado.success = true
        resultado.mensaje = "El archivo se leyó correctamente."
    } catch (error) {
        resultado.success = false
        resultado.mensaje = "El archivo no tiene el formato esperado."
    }

    return resultado
}

const convertidorSTP = (valor, tipo) => {
    if (tipo === "number" || tipo === "decimal") return Number(valor)
    if (tipo === "date") {
        if (valor.length === 8) {
            const aa = valor.substr(0, 4)
            const mm = valor.substr(4, 2)
            const dd = valor.substr(6, 2)
            return new Date(`${aa}`, parseInt(mm) - 1, dd)
        } else return new Date(valor)
    }
    return valor ? valor.trim() : ""
}

export default {
    anchoBBVA,
    delimitadoCONEKTA,
    excelSTP
}
