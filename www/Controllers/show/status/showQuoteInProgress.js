let allQuotes = [];
let filteredQuotes = [];
let currentPage = 1;
const rowsPerPage = 10;

// Función para cargar las cotizaciones
async function loadQuotes() {
    const quoteContainer = document.getElementById("showQuotes");
    const clientIdFromURL = new URLSearchParams(window.location.search).get('clientId');

    try {
        const response = await fetch(allQuotes_route);
        const quotes = await response.json();

        // Filtra las cotizaciones que coincidan con el clientId y tengan estatus 1
        allQuotes = quotes
            .filter(quote => quote.ClientId === clientIdFromURL && quote.Status === 1)
            .sort((a, b) => {
                const [dayA, monthA, yearA] = a.Date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.Date.split('/').map(Number);

                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);

                return dateB - dateA; // Ordena de más reciente a más antigua
            });

        filteredQuotes = allQuotes;
        displayPage(currentPage);
        createPaginationControls();
    } catch (error) {
        console.error("Error al cargar cotizaciones:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');

    if (!clientId) {
        document.getElementById('CompanyClient').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allClients_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const clients = await response.json();

        const client = clients.find(c => c.Id === clientId);

        const clientNameElement = document.getElementById('CompanyClient');
        if (client) {
            if (client.Role === 1) {
                clientNameElement.textContent = `Cotizaciones en curso de: ${client.CompanyName}`;
            } else {
                clientNameElement.textContent = `Cotizaciones en curso de: ${client.Manager}`;
            }
        } else {
            clientNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('CompanyClient').textContent = 'Error fetching client data';
    }
});

function displayPage(page) {
    const quoteContainer = document.getElementById("showQuotes");
    quoteContainer.innerHTML = '';

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const quotesToDisplay = filteredQuotes.slice(start, end);

    const clientIdFromURL = new URLSearchParams(window.location.search).get('clientId');

    quotesToDisplay.forEach(({ QuoteName, Price, Date, Id, TypeQuote }) => {
        const quoteElement = document.createElement("a");

        // Verifica el tipo de cotización (TypeQuote) y asigna la URL correspondiente
        let destinationURL = '';
        if (TypeQuote === 1) {
            destinationURL = `./in-progress2.html?clientId=${clientIdFromURL}&quoteId=${Id}`;
        } else if (TypeQuote === 2) {
            destinationURL = `./in-progress3.html?clientId=${clientIdFromURL}&quoteId=${Id}`;
        } else {
            console.error(`Tipo de cotización desconocido para Quote ID: ${Id}`);
            return; // Si el tipo no es válido, no muestra el enlace
        }

        quoteElement.href = destinationURL;
        quoteElement.classList.add("flex", "items-center", "bg-white", "border", "border-gray-200", "rounded-lg", "shadow", "w-full", "md:w-1/3", "lg:w-1/4", "hover:bg-gray-100", "dark:border-gray-700", "dark:bg-gray-800", "dark:hover:bg-gray-700", "mb-4");

        quoteElement.innerHTML = `
            <div class="flex flex-col justify-between p-4 leading-normal w-full">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${QuoteName}</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Cotización de $${Price.toFixed(2)} generada el ${Date}</p>
            </div>
        `;
        quoteContainer.appendChild(quoteElement);
    });
}

function createPaginationControls() {
    const totalPages = Math.ceil(filteredQuotes.length / rowsPerPage);
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
    const totalPages = Math.ceil(filteredQuotes.length / rowsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayPage(currentPage);
    createPaginationControls();
}

// Función de búsqueda
function searchQuotes() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    filteredQuotes = allQuotes.filter(quote =>
        quote.QuoteName.toLowerCase().includes(searchTerm) ||
        quote.Date.includes(searchTerm)
    );
    currentPage = 1;
    displayPage(currentPage);
    createPaginationControls();
}

window.addEventListener("DOMContentLoaded", loadQuotes);
