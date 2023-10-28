import Componente from "./componente.js"

class Tabla extends Componente {
    constructor() {
        super("section", { clase: "tablaDatos" })
        return this.inicia()
    }

    parseaJSON(json) {
        const keys = Object.keys(json[0])

        const filas = json.map(f => {
            keys.map(k => f[k])
        })

        this.tablaTmp = this.contruirTabla(keys, filas)

        return this
    }

    parseaTexto(texto) {
        const lineas = texto.split("\r\n")
        const encabezados = lineas[0].split(" ")

        const filas = lineas.slice(1).map(l => l.split(" "))
        
        this.tablaTmp = this.contruirTabla(encabezados, filas)
        return this
    }

    contruirTabla(encabezados = [], filas = [], claseEstilo = "") {
        const tbl = new Componente("table", { id: "tabla" })
        const tblEncabezdos = new Componente("thead", { clase: "tblEncabezados" })
        const tblCuerpo = new Componente("tbody", { clase: "tblCuerpo" })

        tblEncabezdos.addHijo(
            new Componente("tr", { clase: "filaEncabezados" })
                .addHijos(
                    encabezados.map(e => new Componente("th", { clase: "celdaEncabezado" }).setTexto(e).getComponente())
                ).getComponente()
        )

        tblCuerpo.addHijos(
            filas.map(f => {
                const fila = new Componente("tr", { clase: "fila" })
                fila.addHijos(
                    f.map(e => new Componente("td", { clase: "celda" }).setTexto(e).getComponente())
                )
                return fila.getComponente()
            }
            )
        )

        tbl.addHijos([
            tblEncabezdos.getComponente(),
            tblCuerpo.getComponente()
        ])

        return tbl
    }

    tablaSinDatos() {
        this.tablaTmp = new Componente("div", { clase: "tablaSinDatos" })
        this.tablaTmp.setTexto("No hay datos para mostrar")
        this.tablaTmp.setPropiedad("style", "width: 100%;height: 100%;text-align: center;font-weight: bold;inset: 0px;margin: auto;display: flex;align-items: center;justify-content: center;")
        return this
    }

    actualizaTabla() {
        if (this.tablaTmp.getComponente().rows.length == 0) this.tablaSinDatos()
        this.tabla.removeComponente()
        this.tabla = this.tablaTmp
        this.contenedor.addHijo(this.tabla.getComponente())
        return this
    }

    inicia() {
        this.controles = new Componente("section", { clase: "controles" })
        this.lblConcepto = new Componente("label", { clase: "lblConcepto parametros" })
        this.selConcepto = new Componente("select", { clase: "selConcepto parametros" })
        this.lblFiltro = new Componente("label", { clase: "lblFiltro parametros" })
        this.txtFiltro = new Componente("input", { clase: "txtFiltro parametros" })
        this.btnFiltro = new Componente("button", { clase: "btnFiltro parametros" })
        this.contenedor = new Componente("div", { clase: "contenedorTabla" })
        this.tablaSinDatos()
        this.tabla = this.tablaTmp
        return this
    }

    configura() {
        this.lblConcepto.setTexto("Concepto")
        this.selctionVacio()
        this.lblFiltro.setTexto("Filtro")
        this.btnFiltro.setTexto("Filtrar")
        return this
    }

    crear() {
        this.addHijos([
            this.controles.addHijos([
                this.lblConcepto.getComponente(),
                this.selConcepto.getComponente(),
                this.lblFiltro.getComponente(),
                this.txtFiltro.getComponente(),
                this.btnFiltro.getComponente()
            ]).getComponente(),
            this.contenedor.addHijo(
                this.tabla.getComponente()
            ).getComponente()
        ])
        return this
    }

    mostrar() {
        return this
            .configura()
            .crear()
            .getComponente()
    }






    selctionVacio() {
        const opcionPredeterminada = new Componente("option", { clase: "opcionPredeterminada" })
        opcionPredeterminada.setTexto("Seleccionar")
        opcionPredeterminada.setValor("Seleccionar")
        this.selConcepto.addHijo(opcionPredeterminada.getComponente())
    }


    // Crear y agregar una nueva opción
    // let nuevaOpcion = document.createElement("option")
    // nuevaOpcion.textContent = "Tu nuevo item"
    // nuevaOpcion.value = "valorDelNuevoItem"
    // select.appendChild(nuevaOpcion)











}

export default Tabla