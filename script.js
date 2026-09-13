fetch("juegos.json")

    .then(response => {
        if (!response.ok) {
            throw new Error("Error: No se encuentran los datos")
        }
        return response.json();
    })
    .then(data => {
        let storage = JSON.parse(localStorage.getItem("carrito")) || [];

        let juegos = document.getElementById("juegos");

        // Crear la lista
        let lista = document.createElement("ul");
        lista.classList.add("game-cards");

        // Crear las tarjetas
        data.forEach(juego => {

            let tarjeta = document.createElement("li");
            tarjeta.classList.add("game-card");

            let imagen = document.createElement("img");
            imagen.src = juego.imagen;
            imagen.alt = juego.titulo;

            let titulo = document.createElement("p");
            titulo.textContent = juego.titulo;

            let precio = document.createElement("p");
            precio.textContent = juego.precio;

            let descripcion = document.createElement("button");
            descripcion.textContent = "Ver descripción";
            descripcion.className = "boton";
            descripcion.id = "ver-descripcion";

            descripcion.addEventListener("click", function () {
                alert(juego.descripcion);
            });

            let enlace = document.createElement("a");
            enlace.classList.add("boton");
            enlace.href = juego.url;
            enlace.textContent = "Ir al sitio del juego";
            enlace.target = "_blank";

            let comprar = document.createElement("button");
            comprar.textContent = "agregar al carrito";
            comprar.classList = "boton";
            comprar.id = "agregarCarrito";

            comprar.addEventListener("click", function () {
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
            tarjeta.appendChild(descripcion);
            tarjeta.appendChild(enlace);
            tarjeta.appendChild(comprar);

            // Agregar tarjeta a la lista
            lista.appendChild(tarjeta);
        });

        // Agregar la lista al contenedor
        juegos.appendChild(lista);

        document.getElementById("ver-carrito").addEventListener("click", function () {
            let productosCarrito = data.filter(
                juego => storage.includes(juego.id)
            );

            let titulos = productosCarrito.map(juego => juego.titulo);

            alert("Los juegos en el carrito son: \n" + titulos.join("\n"));
        });
    })
    .catch(error => {
        console.error("Error al cargar los juegos");
        juegos.innerHTML = `<h1>Error al cargar los juegos</h1>`;
    });