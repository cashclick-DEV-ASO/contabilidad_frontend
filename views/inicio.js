
export const inicio = (contenedor, menu) => {
    // contenedor.appendChild(mostrarContenido())

    const pie = document.createElement("div")
    pie.className = "pie"
    pie.innerHTML = `Dev by Alberto Soto to Cashclick &copy ${new Date().getFullYear()} - All rights reserved`
    contenedor.appendChild(pie)
    return
}