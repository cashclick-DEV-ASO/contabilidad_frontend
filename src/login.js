import Login from "../views/login.js"

const contenido = () => {
	const contenedor = document.querySelector(".login")
	contenedor.appendChild(new Login().mostrar())
}

contenido()
