const boton = document.querySelector(".boton")

boton.addEventListener("click", () => {
    const user = document.querySelector("#user").value
    const pass = document.querySelector("#pass").value
    fetch("http://0.0.0.0:0")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            window.location.href = "http://127.0.0.1:3030/"
        })
        .catch(error => console.log(error))
});