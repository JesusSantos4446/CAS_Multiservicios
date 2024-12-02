document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');

    if (!clientId) {
        document.getElementById('ClientName').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allClients_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const clients = await response.json();

        const client = clients.find(c => c.Id === clientId);

        const clientNameElement = document.getElementById('ClientName');
        if (client) {
            // Asigna directamente el Manager al elemento sin hacer más comparaciones
            clientNameElement.textContent = client.Manager;
        } else {
            clientNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('ClientName').textContent = 'Error fetching client data';
    }
});

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
                clientNameElement.textContent = client.CompanyName;
            } else {
                clientNameElement.textContent = client.Manager;
            }
        } else {
            clientNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('CompanyClient').textContent = 'Error fetching client data';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('quoteId');

    if (!quoteId) {
        document.getElementById('CotName').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const quotes = await response.json();

        const quote = quotes.find(q => q.Id === quoteId);

        const quoteNameElement = document.getElementById('CotName');
        if (quote) {
            quoteNameElement.textContent = `Cotización No: ${quote.QuoteName}`;
        } else {
            quoteNameElement.textContent = 'Quote not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('CotName').textContent = 'Error fetching client data';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('quoteId');

    if (!quoteId) {
        document.getElementById('DateQuote').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const quotes = await response.json();

        const quote = quotes.find(q => q.Id === quoteId);

        const quoteNameElement = document.getElementById('DateQuote');
        if (quote) {
            quoteNameElement.textContent = `Cotización generada el ${quote.Date}.`;
        } else {
            quoteNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('DateQuote').textContent = 'Error fetching client data';
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get("clientId");
    const quoteId = urlParams.get("quoteId");

    try {
        const response = await fetch(allQuotes_route);
        const quotes = await response.json();

        const filteredQuote = quotes.find(quote => quote.ClientId === clientId && quote.Id === quoteId);

        if (filteredQuote) {
            const tableBody = document.getElementById("quotesTableBody");

            // Calcular el subtotal
            const subtotal = filteredQuote.Price * filteredQuote.Amount;

            // Calcular IVA
            const ivaPercentage = filteredQuote.PercentageIVA;
            const ivaAmount = (subtotal * ivaPercentage) / 100;

            // Calcular Retención ISR (10% como ejemplo)
            const isrPercentage = 10; // Define el porcentaje de ISR
            const isrRetention = (subtotal * isrPercentage) / 100;

            // Calcular Retención IVA (6% como ejemplo)
            const retIvaPercentage = 2 / 3; // Define el porcentaje de Ret IVA
            const retIvaAmount = (ivaAmount * retIvaPercentage);

            // Calcular el total incluyendo IVA y restando retenciones
            const totalInclIVA = subtotal + ivaAmount - isrRetention - retIvaAmount;

            const row = `
                <tr style="height:41.5pt">
                    <td style="width:12.8pt; padding: 5.4pt; vertical-align:top; background-color:#f2f2f2">
                        <p style="margin-bottom:0pt; font-size:8pt; font-weight:bold">1</p>
                    </td>
                    <td style="width:57pt; padding: 5.4pt; vertical-align:top; background-color:#f2f2f2">
                        <p style="margin-bottom:0pt; font-size:8pt">${filteredQuote.NoCode}</p>
                    </td>
                    <td style="width:143.95pt; padding: 5.4pt; vertical-align:top; background-color:#f2f2f2">
                        <p style="margin-bottom:0pt; font-size:8pt">${filteredQuote.ProductServiceName}</p>
                    </td>
                    <td style="width:43.35pt; padding: 5.4pt; vertical-align:top; background-color:#f2f2f2; text-align:center;">
                        <p style="margin-bottom:0pt; font-size:8pt">${filteredQuote.Amount}</p>
                    </td>
                    <td style="width:68.35pt; padding: 5.4pt; vertical-align:top; background-color:#f2f2f2; text-align:right;">
                        <p style="margin-bottom:0pt; font-size:8pt">$${filteredQuote.Price.toFixed(2)}</p>
                    </td>
                    <td style="width:55pt; padding: 5.4pt; vertical-align:top; background-color:#f2f2f2; text-align:right;">
                        <p style="margin-bottom:0pt; font-size:8pt">$${subtotal.toFixed(2)}</p>
                    </td>
                </tr>
            `;

            tableBody.innerHTML = row;

            // Mostrar valores en el resumen
            document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
            document.getElementById("ivaPercentage").innerText = `${ivaPercentage}%`;
            document.getElementById("ivaAmount").innerText = `$${ivaAmount.toFixed(2)}`;
            document.getElementById("isr").innerText = `$${isrRetention.toFixed(2)}`;
            document.getElementById("retiva").innerText = `$${retIvaAmount.toFixed(2)}`;
            document.getElementById("totalInclIVA").innerText = `$${totalInclIVA.toFixed(2)}`;
        } else {
            console.error("No se encontró ninguna cotización con el clientId y quoteId especificados.");
        }
    } catch (error) {
        console.error("Error al obtener las cotizaciones:", error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('quoteId');

    if (!quoteId) {
        document.getElementById('EndDateQuote').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const quotes = await response.json();

        const quote = quotes.find(q => q.Id === quoteId);

        const quoteNameElement = document.getElementById('EndDateQuote');
        if (quote) {
            const [day, month, year] = quote.Date.split('/').map(Number);
            const fechaOriginal = new Date(year, month - 1, day);
            
            // Sumar 2 días a la fecha original
            fechaOriginal.setDate(fechaOriginal.getDate() + 2);

            // Array de nombres de los meses en español
            const meses = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
            ];

            // Formatear la fecha en palabras
            const fechaEnPalabras = `${fechaOriginal.getDate()} de ${meses[fechaOriginal.getMonth()]} del ${fechaOriginal.getFullYear()}`;

            // Mostrar el resultado en el elemento
            quoteNameElement.textContent = `${fechaEnPalabras} `;
        } else {
            quoteNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('EndDateQuote').textContent = 'Error fetching client data';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Aquí cargarías los datos que necesites.
    // Una vez que todo el contenido esté listo, envía un mensaje al padre.
    window.parent.postMessage('contentLoaded', '*');
});


