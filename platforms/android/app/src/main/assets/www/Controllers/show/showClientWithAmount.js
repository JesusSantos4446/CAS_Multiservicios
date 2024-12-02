async function loadClientsAndQuotes() {
    const clientContainer = document.getElementById("showThings"); // Selecciona el contenedor de la lista por ID

    try {
        // Obtener lista de clientes
        const clientsResponse = await fetch(allClients_route); // Cambia "API_URL/clientes" a tu endpoint de clientes
        const clients = await clientsResponse.json();

        // Obtener todas las cotizaciones
        const quotesResponse = await fetch(allQuotes_route); // Cambia "API_URL/cotizaciones" a tu endpoint de cotizaciones
        const quotes = await quotesResponse.json();

        // Almacenar clientes y sus precios totales
        const clientsWithTotal = [];

        // Recorrer cada cliente y calcular el total de sus cotizaciones
        for (const client of clients) {
            // Filtrar las cotizaciones que pertenecen al cliente actual
            const clientQuotes = quotes.filter(quote => quote.ClientId === client.Id);

            // Calcular el precio total de las cotizaciones del cliente, o $0.00 si no hay cotizaciones
            const totalPrice = clientQuotes.length > 0 
                ? clientQuotes.reduce((acc, quote) => {
                    // Convertir el precio de string a número
                    const price = parseFloat(quote.Price);
                    return acc + (isNaN(price) ? 0 : price); // Si no es un número, sumar 0
                }, 0)
                : 0;

            // Almacenar cliente y su total
            clientsWithTotal.push({ client, totalPrice });
        }

        // Ordenar los clientes por precio total de manera ascendente
        clientsWithTotal.sort((a, b) => b.totalPrice - a.totalPrice);

        // Limpiar el contenedor antes de agregar los elementos
        clientContainer.innerHTML = '';

        // Añadir los elementos al contenedor
        for (const { client, totalPrice } of clientsWithTotal) {
            // Definir la imagen y el nombre según el tipo de cliente
            const imageUrl = client.Role === 1 ? `${viewImg_route + client.Email}.jpg` : "../public/img/user.jpg";
            const clientName = client.Role === 1 ? client.CompanyName : client.Manager;

            // Crear el elemento HTML para el cliente
            const clientElement = document.createElement("a");
            clientElement.href = `../Views/cotizacion-vista1.html?clientId=${client.Id}`;
            clientElement.classList.add("flex", "items-center", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow", "w-full", "md:w-1/3", "lg:w-1/4", "hover:bg-gray-100", "dark:border-gray-700", "dark:bg-gray-800", "dark:hover:bg-gray-700", "mb-4");

            clientElement.innerHTML = `
                <img class="object-cover w-32 h-32 rounded-l-lg" src="${imageUrl}" alt="">
                <div class="flex flex-col justify-between p-4 leading-normal w-full">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${clientName}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">$${totalPrice.toFixed(2)}</p>
                </div>
            `;

            // Añadir el elemento al contenedor
            clientContainer.appendChild(clientElement);
        }
    } catch (error) {
        console.error("Error al cargar clientes o cotizaciones:", error);
    }
}

// Llamar a la función cuando se cargue la página
window.addEventListener("DOMContentLoaded", loadClientsAndQuotes);
