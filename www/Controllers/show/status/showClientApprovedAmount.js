let allClients = []; // Aquí se almacenarán todos los clientes
let filteredClients = []; // Aquí se almacenarán los resultados de búsqueda filtrados
let currentPage = 1;
const rowsPerPage = 10; // Número de clientes por página

// Función para cargar los clientes y las cotizaciones
async function loadClientsAndQuotes() {
    const clientContainer = document.getElementById("showThings");

    try {
        const clientsResponse = await fetch(allClients_route);
        const clients = await clientsResponse.json();

        const quotesResponse = await fetch(allQuotes_route);
        const quotes = await quotesResponse.json();

        allClients = clients.map(client => {
            // Filtra las cotizaciones del cliente actual que tengan status = 1
            const clientQuotes = quotes.filter(quote => quote.ClientId === client.Id && quote.Status === 4);
            
            // Calcula el totalPrice solo con las cotizaciones filtradas
            const totalPrice = clientQuotes.reduce((acc, quote) => {
                const price = parseFloat(quote.Price);
                return acc + (isNaN(price) ? 0 : price);
            }, 0);

            return { ...client, totalPrice };
        });

        allClients.sort((a, b) => b.totalPrice - a.totalPrice);
        filteredClients = allClients; // Inicialmente, mostramos todos los clientes
        displayPage(currentPage);
        createPaginationControls();
    } catch (error) {
        console.error("Error al cargar clientes o cotizaciones:", error);
    }
}

// Función para mostrar los clientes en la página actual
function displayPage(page) {
    const clientContainer = document.getElementById("showThings");
    clientContainer.innerHTML = '';

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const clientsToDisplay = filteredClients.slice(start, end);

    clientsToDisplay.forEach(({ CompanyName, Manager, totalPrice, Role, Email, Id }) => {
        const imageUrl = Role === 1 ? `${viewImg_route + Email}.jpg` : "../../public/img/guess.jpg";
        const clientName = Role === 1 ? CompanyName : Manager;

        const clientElement = document.createElement("a");
        clientElement.href = `./approved1.html?clientId=${Id}`;
        clientElement.classList.add("flex", "items-center", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow", "w-full", "md:w-1/3", "lg:w-1/4", "hover:bg-gray-100", "dark:border-gray-700", "dark:bg-gray-800", "dark:hover:bg-gray-700", "mb-4");

        clientElement.innerHTML = `
            <img class="object-cover w-32 h-32 rounded-l-lg" src="${imageUrl}" alt="">
            <div class="flex flex-col justify-between p-4 leading-normal w-full">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${clientName}</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">$${totalPrice.toFixed(2)}</p>
            </div>
        `;
        clientContainer.appendChild(clientElement);
    });
}

function createPaginationControls() {
    const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
    const paginationContainer = document.getElementById("paginationControls");
    paginationContainer.innerHTML = '';

    // Botón "Anterior"
    const prevButton = `
        <li>
            <a href="#" onclick="${currentPage > 1 ? `changePage(${currentPage - 1})` : 'return false;'}"
                class="flex items-center justify-center px-4 h-10 leading-tight ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white border border-e-0 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}">
                <span class="sr-only">Previous</span>
                <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
            </a>
        </li>
    `;
    paginationContainer.insertAdjacentHTML('beforeend', prevButton);

    // Botones de número de página
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = `
            <li>
                <a href="#" onclick="changePage(${i})"
                    class="flex items-center justify-center px-4 h-10 leading-tight ${i === currentPage ? 'text-blue-600 border border-blue-300 bg-blue-50 dark:bg-gray-700 dark:text-white' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}">
                    ${i}
                </a>
            </li>
        `;
        paginationContainer.insertAdjacentHTML('beforeend', pageButton);
    }

    // Botón "Siguiente"
    const nextButton = `
        <li>
            <a href="#" onclick="${currentPage < totalPages ? `changePage(${currentPage + 1})` : 'return false;'}"
                class="flex items-center justify-center px-4 h-10 leading-tight ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}">
                <span class="sr-only">Next</span>
                <svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
            </a>
        </li>
    `;
    paginationContainer.insertAdjacentHTML('beforeend', nextButton);
}

// Función para cambiar de página
function changePage(page) {
    const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
    if (page < 1 || page > totalPages) return; // Evita cambiar si la página está fuera de rango
    currentPage = page;
    displayPage(currentPage);
    createPaginationControls();
}

// Función de búsqueda
function searchClients() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    filteredClients = allClients.filter(client =>
        client.CompanyName.toLowerCase().includes(searchTerm) ||
        client.Manager.toLowerCase().includes(searchTerm)
    );
    currentPage = 1; // Reiniciar a la primera página después de la búsqueda
    displayPage(currentPage);
    createPaginationControls();
}

window.addEventListener("DOMContentLoaded", loadClientsAndQuotes);