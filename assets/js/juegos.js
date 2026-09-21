// Contenedor de juegos
const juegos = document.getElementById("juegos");

// Carrito en memoria
let storage = JSON.parse(localStorage.getItem("carrito")) || [];

// Buscador
const buscador = document.querySelector("#buscador");

// Buscar juego
function buscarJuegos() {
    const busqueda = document
        .querySelector("#input-buscar")
        .value
        .toLowerCase();

    const tarjetas = document.querySelectorAll(".game-card");

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta
            .querySelector(".titulo-juego")
            .textContent
            .toLowerCase();

        if (titulo.includes(busqueda)) {
            tarjeta.style.display = "";
        } else {
            tarjeta.style.display = "none";
        }
    });
}

buscador.addEventListener("submit", (event) => {
    event.preventDefault();

    buscarJuegos();
});



// Crear la descripción del juego
function mostrarDescripcion(tarjeta, juego) {
    const descripcionJuego = document.createElement("div");

    descripcionJuego.classList.add("descripcion-juego");
    descripcionJuego.textContent = juego.descripcion;

    tarjeta.appendChild(descripcionJuego);

    const rect = descripcionJuego.getBoundingClientRect();

    // Si se sale por la derecha de la pantalla
    if (rect.right > window.innerWidth) {
        descripcionJuego.classList.add("left");
    }
}

// Eliminar la descripción del juego
function ocultarDescripcion(tarjeta) {
    const descripcionJuego = tarjeta.querySelector(".descripcion-juego");

    if (descripcionJuego) {
        descripcionJuego.remove();
    }
}

// Agregar juego al carrito
function agregarAlCarrito(juego) {
    // Verificar si el juego ya se encuentra en el carrito
    if (storage.includes(juego.id)) {
        mostrarModal("El juego ya se encuentra en el carrito");
        return;
    }

    storage.push(juego.id);
    localStorage.setItem("carrito", JSON.stringify(storage));

    mostrarModal("El juego " + juego.titulo + " ha sido agregado");
}

// Eliminar juego del carrito
function eliminarJuego(juego, todoJuegos) {

    storage = storage.filter(id => id !== juego.id);

    localStorage.setItem("carrito", JSON.stringify(storage));

    mostrarCarrito(todoJuegos);
}

// Limpiar el carrito
function limpiarCarrito() {
    storage = [];

    localStorage.setItem("carrito", JSON.stringify(storage));

    const contenidoCarrito =
        document.querySelector("#contenido-carrito");

    contenidoCarrito.innerHTML = "";
    contenidoCarrito.textContent = "El carrito está vacío";
}

// Mostrar modal
function mostrarModal(mensaje) {
    const mensajeModal = document.querySelector("#mensaje");

    mensajeModal.textContent = mensaje;

    const modal = new bootstrap.Modal(
        document.querySelector("#modal-mensaje"),
    )

    modal.show();
}

// Crear una tarjeta de juego
function crearTarjeta(juego) {
    const tarjeta = document.createElement("li");
    tarjeta.classList.add("game-card");

    // Imagen
    const imagen = document.createElement("img");
    imagen.src = juego.imagen;
    imagen.alt = juego.titulo;

    // Título
    const titulo = document.createElement("p");
    titulo.classList.add("titulo-juego");
    titulo.textContent = juego.titulo;

    // Precio
    const precio = document.createElement("p");
    precio.textContent = "CLP$ " + juego.precio;

    // Mostrar descripción al entrar a la tarjeta
    tarjeta.addEventListener("mouseenter", function () {
        mostrarDescripcion(tarjeta, juego);
    });

    // Ocultar descripción al salir de la tarjeta
    tarjeta.addEventListener("mouseleave", function () {
        ocultarDescripcion(tarjeta);
    });

    // Enlace al sitio del juego
    const enlace = document.createElement("a");
    enlace.classList.add("boton");
    enlace.textContent = "Ir al sitio del juego";

    // Si el juego no tiene URL
    if (juego.url === "noURL") {
        enlace.addEventListener("click", function () {
            mostrarModal("El juego " + juego.titulo + " no cuenta con una URL");
        });
    } else {
        enlace.href = juego.url;
        enlace.target = "_blank";
    }

    // Botón para agregar al carrito
    const agregarCarrito = document.createElement("button");
    agregarCarrito.textContent = "agregar al carrito";
    agregarCarrito.classList.add("boton");

    agregarCarrito.addEventListener("click", function () {
        agregarAlCarrito(juego);
    });

    // Agregar elementos a la tarjeta
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(enlace);
    tarjeta.appendChild(agregarCarrito);

    return tarjeta;
}

// Mostrar carrito
function mostrarCarrito(todoJuegos) {
    const contenidoCarrito = document.querySelector("#contenido-carrito");

    contenidoCarrito.innerHTML = "";

    const productosCarrito = todoJuegos.filter(
        juego => storage.includes(juego.id)
    );

    if (productosCarrito.length === 0) {
        contenidoCarrito.textContent = "El carrito esta vacio";
    } else {

        productosCarrito.forEach(juego => {

            const producto = document.createElement("div");
            producto.classList.add("d-flex", "justify-content-between", "mb-2");

            const titulo = document.createElement("span");
            titulo.textContent = juego.titulo;

            const precio = document.createElement("span");
            precio.textContent = "CLP$ " + juego.precio;

            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.classList.add("btn", "btn-danger", "btn-sm");

            botonEliminar.addEventListener("click", function () {
                eliminarJuego(juego, todoJuegos);
            });

            producto.appendChild(titulo);
            producto.appendChild(precio);
            producto.appendChild(botonEliminar);

            contenidoCarrito.appendChild(producto);
        });
    }

    const modal = new bootstrap.Modal(
        document.querySelector("#modal-carrito"),
    );

    modal.show();
}

// Cargar los juegos
function cargarJuegos() {
    fetch("juegos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error: No se encuentran los datos");
            }

            return response.json();
        })
        .then(data => {
            // Juegos nuevos
            const juegosNuevos =
                JSON.parse(localStorage.getItem("nuevoJuego")) || [];

            // Todos los juegos
            const todoJuegos = [...data, ...juegosNuevos];

            // Crear la lista
            const lista = document.createElement("ul");
            lista.classList.add("game-cards");

            // Crear las tarjetas
            todoJuegos.forEach(juego => {
                const tarjeta = crearTarjeta(juego);
                lista.appendChild(tarjeta);
            });

            // Agregar la lista al contenedor
            juegos.appendChild(lista);

            // Ver el carrito
            document
                .getElementById("ver-carrito")
                .addEventListener("click", function () {
                    mostrarCarrito(todoJuegos);
                });

            document.querySelector("#limpiar-carrito").addEventListener("click", function () {
                limpiarCarrito();
            });
        })
        .catch(error => {
            console.error("Error al cargar los juegos:", error);
            juegos.innerHTML = "<h1>Error al cargar los juegos</h1>";
        });
}

// Iniciar carga de juegos
cargarJuegos();

