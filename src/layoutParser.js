export const anchoBBVA = (texto, layout) => {
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
        const idRegistro = getIdentificador(texto, 0, 1)

        if (idRegistro === idRegInfo) {
            resultado.informacion.apertura = extraeCampos(texto, camposInfo)
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

        resultado.success = false
        resultado.mensaje =
            "El archivo tiene registros no contemplados en el layout.\nSe recomienda hacer una revisión manual."
        resultado.lineaError.push([linea, texto])
    })

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

export default {
    anchoBBVA
}
