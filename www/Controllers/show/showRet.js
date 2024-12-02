async function loadQuotes() {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    const quoteId = urlParams.get('quoteId');

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const quotes = await response.json();
        const filteredQuote = quotes.find(quote => quote.Id === quoteId && quote.ClientId === clientId);

        if (filteredQuote) {
            populateTable(filteredQuote);
        } else {
            console.log('No se encontró ninguna cotización que coincida con los filtros.');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

function populateTable(quote) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    // Cálculos
    const subtotal = quote.Price * quote.Amount;
    const ivaPercentage = quote.PercentageIVA;
    const ivaAmount = (subtotal * ivaPercentage) / 100;

    // Retenciones (porcentajes de ejemplo, ajusta según sea necesario)
    const retISRPercentage = 10; // Porcentaje de retención ISR
    const retIVAPercentage = 2 / 3;  // Porcentaje de retención IVA

    const retISR = (subtotal * retISRPercentage) / 100;
    const retIVA = (ivaAmount * retIVAPercentage);

    // Precio total ajustado con IVA y retenciones
    const totalPrice = subtotal + ivaAmount - retISR - retIVA;

    // Fila de la tabla con los datos de la cotización
    const rowHTML = `
        <tr class="bg-white dark:bg-gray-800">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">1</th>
            <td class="px-6 py-4">${quote.NoCode}</td>
            <td class="px-6 py-4">${quote.ProductServiceName}</td>
            <td class="px-6 py-4">${quote.Amount}</td>
            <td class="px-6 py-4">$${quote.Price.toFixed(2)}</td>
            <td class="px-6 py-4">$${subtotal.toFixed(2)}</td>
        </tr>
    `;

    tableBody.innerHTML = rowHTML;

    // Pie de tabla con los totales
    const tableFooter = document.querySelector('table tfoot');
    tableFooter.innerHTML = `
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">Subtotal (excl. IVA)</th>
            <td class="px-6 py-3">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">+${ivaPercentage}% IVA</th>
            <td class="px-6 py-3">$${ivaAmount.toFixed(2)}</td>
        </tr>
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">Ret. ISR</th>
            <td class="px-6 py-3">$${retISR.toFixed(2)}</td>
        </tr>
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">Ret. IVA</th>
            <td class="px-6 py-3">$${retIVA.toFixed(2)}</td>
        </tr>
        <tr class="font-semibold text-gray-900 dark:text-white">
            <th scope="row" class="px-6 py-3 text-base"></th>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <td class="px-6 py-3"></td>
            <th scope="row" class="px-6 py-3 text-base">Precio Total (Incl. IVA y Retenciones)</th>
            <td class="px-6 py-3">$${totalPrice.toFixed(2)}</td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', loadQuotes);
