// Cargar los juegos
fetch("juegos.json")

    .then(response => {
        if (!response.ok) {
            throw new Error("Error: No se encuentran los datos")
        }
        return response.json();
    })
    .then(data => {
        // Carrito en memoria
        let storage = JSON.parse(localStorage.getItem("carrito")) || [];

        // Juegos nuevos
        let juegosNuevos = JSON.parse(localStorage.getItem("nuevoJuego")) || [];

        // Todos los guegos
        let todoJuegos = [...data, ...juegosNuevos];

        // Contenedor de juegos
        let juegos = document.getElementById("juegos");

        // Crear la lista
        let lista = document.createElement("ul");
        lista.classList.add("game-cards");

        // Crear las tarjetas
        todoJuegos.forEach(juego => {

            let tarjeta = document.createElement("li");
            tarjeta.classList.add("game-card");

            let imagen = document.createElement("img");
            imagen.src = juego.imagen;
            imagen.alt = juego.titulo;

            let titulo = document.createElement("p");
            titulo.textContent = juego.titulo;

            let precio = document.createElement("p");
            precio.textContent = juego.precio;

            // Desplegar descripcion al pasar el mouse
            tarjeta.addEventListener("mouseover", function () {
                const descripcionJuego = document.createElement("div");


                descripcionJuego.classList.add("descripcion-juego");
                descripcionJuego.textContent = juego.descripcion;

                tarjeta.appendChild(descripcionJuego);


                const rect = descripcionJuego.getBoundingClientRect();

                // Si se sale por la derecha de la pantalla
                if (rect.right > window.innerWidth) {
                    descripcionJuego.classList.add("left");
                }
            });

            // Remover la descripcion al quitar el mouse
            tarjeta.addEventListener("mouseout", function () {
                let descripcionJuego = document.querySelector(".descripcion-juego");
                tarjeta.removeChild(descripcionJuego);
            });

            let enlace = document.createElement("a");
            enlace.classList.add("boton");

            // Si el juego no tiene URL
            if (juego.url === "noURL") {
                enlace.addEventListener("click", function () {
                    alert("El juego " + juego.titulo + " no cuenta con una URL");
                })
            }
            else {
                enlace.href = juego.url;
                enlace.target = "_blank";
            }
            enlace.textContent = "Ir al sitio del juego";
            enlace.target = "_blank";

            let agregarCarrito = document.createElement("button");
            agregarCarrito.textContent = "agregar al carrito";
            agregarCarrito.classList = "boton";
            agregarCarrito.id = "agregarCarrito";

            // Agregar juego al carrito
            agregarCarrito.addEventListener("click", function () {
                // Verificar si el juego ya se encuentra en el carrito
                if (storage.includes(juego.id)) {
                    alert("El juego ya se encuentra en el carrito");
                    return;
                }
                else {
                    alert("El juego " + juego.titulo + " ha sido agregado al carrito");
                }

                storage.push(juego.id);
                localStorage.setItem("carrito", JSON.stringify(storage));
            });

            // Agregar elementos a la tarjeta
            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(precio);
            tarjeta.appendChild(enlace);
            tarjeta.appendChild(agregarCarrito);

            lista.appendChild(tarjeta);
        });

        // Agregar la lista al contenedor
        juegos.appendChild(lista);

        // Ver el carrito
        document.getElementById("ver-carrito").addEventListener("click", function () {
            let productosCarrito = todoJuegos.filter(
                juego => storage.includes(juego.id)
            );

            let titulos = productosCarrito.map(juego => juego.titulo);

            // Si el carrito esta vacio
            if (titulos.length === 0) {
                alert("El carrito está vacío");
                return;
            }
            else {
                alert("Los juegos en el carrito son: \n" + titulos.join("\n"));
            }

        });
    })
    .catch(error => {
        console.error("Error al cargar los juegos");
        juegos.innerHTML = `<h1>Error al cargar los juegos</h1>`;
    });