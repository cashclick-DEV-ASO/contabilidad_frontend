// Estructura de rutas
export const RUTAS = {
    inicio: {
        visible: true,
        titulo: "Inicio",
        vista: "Inicio"
    },
    transacciones: {
        visible: true,
        titulo: "Transacciones",
        vista: {
            bancos: {
                visible: true,
                titulo: "Bancos",
                vista: "Bancos"
            },
            dwh: {
                visible: true,
                titulo: "DWH",
                vista: "DWH"
            },
            mambu: {
                visible: true,
                titulo: "Mambu",
                vista: "Mambu"
            }
        }
    },
    conciliacion: {
        visible: true,
        titulo: "Conciliacion",
        vista: "Conciliacion"
    },
    reportes: {
        visible: true,
        titulo: "Reportes",
        vista: {
            resConciliacion: {
                visible: true,
                titulo: "Resumen Conciliacion",
                vista: "ResConciliacion"
            },
            recInteres: {
                visible: true,
                titulo: "Recalculo Interes",
                vista: "RecInteres"
            }
        }
    },
    configuracion: {
        visible: true,
        titulo: "Configuracion",
        vista: "Configuraciones"
    }
}

// Valores por defecto generales
export const ANIO_MINIMO = 2020
export const FORMATOS_BBVA = ".txt, .exp"

// Clases
export const NAVEGACION = "navegacion"
export const UL_MENU = "ulMenu"
export const LI_MENU = "liMenu"
export const UL_SUBMENU = "ulSubMenu"
export const LI_SUBMENU = "liSubMenu"
export const TXT_DEFAULT_CLS = "txtDefault"
export const SEL_PERIODO_CLS = "selPeriodo"
export const TITULO_PERIODO_CLS = "tituloPeriodo"
export const ANIO_PERIODO_ID = "anioPeriodo"
export const MES_PERIODO_ID = "mesPeriodo"
export const ANIO_PERIODO_LBL_ID = "lblAnioPeriodo"
export const MES_PERIODO_LBL_ID = "lblMesPeriodo"
export const MSJ_CONTENEDOR_CLS = "msjContenedor"
export const PERIODO_ESTILO_1 = "cuadrado"
export const PERIODO_ESTILO_2 = "largo"
export const PIE_CLS = "pie"

// Valores por defecto de los elementos
export const BTN_TXT_DEFAULT = "Botón"
export const LBL_TXT_DEFAULT = "Etiqueta"
export const SPN_TXT_DEFAULT = "Texto"
export const MSJ_PIE = `Dev by Alberto Soto to Cashclick &copy ${new Date().getFullYear()} - All rights reserved`
