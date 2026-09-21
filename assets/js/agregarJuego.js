// Mostrar modal
function mostrarModal(mensaje) {
    const mensajeModal = document.querySelector("#mensaje");

    mensajeModal.textContent = mensaje;

    const modal = new bootstrap.Modal(
        document.querySelector("#modal"),
    )

    modal.show();
}

// Cargar los juegos

fetch("juegos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error: No se encuentran los datos")
        }
        return response.json();
    })
    .then(data => {

        const formulario = document.querySelector("#formulario");

        // Agregar juego nuevo a la pagina
        formulario.addEventListener("submit", (event) => {
            const storage = JSON.parse(localStorage.getItem("nuevoJuego")) || [];

            event.preventDefault();

            // Obtener el ultimo id
            const ultimoId = [...data, ...storage]
                .reduce((max, juego) => Math.max(max, juego.id), 0);

            const nuevoId = ultimoId + 1;

            // Datos del juego
                const titulo = document.querySelector("#titulo").value;
                const descripcion = document.querySelector("#descripcion").value;
                const precio = document.querySelector("#precio").value;
                const imagen = document.querySelector("#imagen").value;
                const url = document.querySelector("#url").value;

            // Validaciones
            if (titulo === "") {
                mostrarModal("El juego debe tener un titulo");
                return;
            }

            if (precio === "") {
                mostrarModal("El juego debe tener un precio");
                return;
            }

            const juego = {
                id: nuevoId,
                titulo: titulo,
                descripcion: descripcion === "" ? "Sin descripcion" : descripcion,
                precio: + precio,
                imagen: imagen === "" ? "assets/img/sin-imagen.jpg" : imagen,
                url: url === "" ? "noURL" : url
            }

            // Agregar juego
            storage.push(juego);
            localStorage.setItem("nuevoJuego", JSON.stringify(storage));

            mostrarModal("El juego " + juego.titulo + " ha sido agregado");
            formulario.reset();
        });
    })
    .catch(error => {
        console.error(error);
    });
