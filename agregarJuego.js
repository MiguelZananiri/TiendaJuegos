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
            const juego = {
                id: nuevoId,
                titulo: document.querySelector("#titulo").value,
                descripcion: document.querySelector("#descripcion").value,
                precio: "CLP$ " + document.querySelector("#precio").value,
                imagen: document.querySelector("#imagen").value,
                url: document.querySelector("#url").value
            };

            // Validaciones
            if (juego.titulo === "") {
                alert("El juego debe tener un titulo");
                return;
            }

            if (juego.descripcion === "") {
                juego.descripcion = "Sin descripcion";
            }

            if (juego.precio === "") {
                alert("El juego debe tener un precio");
                return;
            }

            if (juego.imagen === "") {
                juego.imagen = "img/sin-imagen.jpg";
            }

            if (juego.url === "") {
                juego.url = "noURL";
            }

            // Agregar juego
            storage.push(juego);
            localStorage.setItem("nuevoJuego", JSON.stringify(storage));

            alert("El juego " + juego.titulo + " ha sido agregado");
            formulario.reset();
        });
    })
    .catch(error => {
        console.error(error);
    });
