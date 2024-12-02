let choices;

document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("noCode");

    choices = new Choices(selectElement, {
        searchEnabled: true,
        itemSelectText: '',
        removeItemButton: true,
        searchResultLimit: 1000,
        renderChoiceLimit: 1000
    });

    const searchCatalog = async (query) => {
        try {
            if (query.length < 2) return;

            const response = await fetch(`${searchInCatalog_route}?query=${encodeURIComponent(query)}&limit=10`);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            selectElement.innerHTML = '<option value="">Selecciona una opción</option>';

            choices.clearChoices();
            choices.setChoices(data.map(catalog => ({
                value: catalog.Code,
                label: catalog.ProductService,
                selected: false
            })), 'value', 'label', false);

        } catch (error) {
            console.error("Error al realizar la búsqueda:", error);
        }
    };

    selectElement.addEventListener("search", function (event) {
        searchCatalog(event.detail.value);
    });
});


async function createQuote(event) {
  event.preventDefault();

  const productServiceName = document.getElementById('productServiceName').value;
  const typeQuote = document.getElementById('typeQuote').value;
  const price = document.getElementById('price').value;
  const amount = document.getElementById('amount').value;
  const percentageIVA = document.getElementById('percentageIVA').value;
  const currency = document.getElementById('currency').value;
  const noCode = choices.getValue(true);
  const clientId = new URLSearchParams(window.location.search).get('clientId');

  if (!noCode) {
      alert('Por favor selecciona un código válido.');
      return;
  }

  const quoteData = {
      quoteName: "COT 0000-CMS0924",
      status: 1,
      typeQuote: parseInt(typeQuote),
      clientId,
      productServiceName,
      noCode,
      price: parseFloat(price),
      amount: parseInt(amount),
      currency: parseInt(currency),
      percentageIVA: parseInt(percentageIVA),
  };

  try {
      const response = await fetch(addQuote_route, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
      }

      const result = await response.json();
      console.log('Cotización registrada:', result);

      const quoteId = result.id;

      if (typeQuote === '1') {
          window.location.href = `cotizacion-vista2.html?clientId=${clientId}&quoteId=${quoteId}`;
      } else if (typeQuote === '2') {
          window.location.href = `cotizacion-vista3.html?clientId=${clientId}&quoteId=${quoteId}`;
      } else {
          console.error('Valor inesperado para typeQuote:', typeQuote);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}


async function loadQuotesTable() {
    try {
      const quotesResponse = await fetch(allQuotes_route);
      const clientsResponse = await fetch(allClients_route);
      
      const quotes = await quotesResponse.json();
      const clients = await clientsResponse.json();
      
      const clientsMap = {};
      clients.forEach(client => {
        clientsMap[client.Id] = client;
      });
  
      quotes.sort((a, b) => {
        const [dayA, monthA, yearA] = a.Date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.Date.split("/").map(Number);
        const dateA = new Date(yearA + 2000, monthA - 1, dayA);
        const dateB = new Date(yearB + 2000, monthB - 1, dayB);
        return dateB - dateA;
      });

      const tableBody = document.getElementById("quotes-table-body");
      tableBody.innerHTML = "";
  
      quotes.forEach(quote => {
        const client = clientsMap[quote.ClientId];
        if (!client) return;
  
        const clientName = client.Role === 1 ? client.CompanyName : client.Manager;
        const clientRoleDetail = client.Role === 1 ? client.Manager : "";
  
        const clientImageSrc = client.Role === 1 
          ? `${viewImg_route + client.Email}.jpg` 
          : "../public/img/guess.jpg";
  
        let statusText = "";
        let statusClass = "";
        switch (quote.Status) {
          case 1:
            statusText = "En curso";
            statusClass = "text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600";
            break;
          case 2:
            statusText = "Pendiente";
            statusClass = "text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700";
            break;
          case 3:
            statusText = "No aprobado";
            statusClass = "text-red-700 bg-red-100 dark:text-red-100 dark:bg-red-700";
            break;
          case 4:
            statusText = "Aprobado";
            statusClass = "text-green-700 bg-green-100 dark:text-green-100 dark:bg-green-700";
            break;
        }
  
        const row = document.createElement("tr");
        row.classList.add("text-gray-700", "dark:text-gray-400");
  
        row.innerHTML = `
          <td class="px-4 py-3">
            <div class="flex items-center text-sm">
              <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                <img
                  class="object-cover w-full h-full rounded-full"
                  src="${clientImageSrc}"
                  alt="${clientName}"
                  loading="lazy"
                />
                <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
              </div>
              <div>
                <p class="font-semibold">${clientName}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">${clientRoleDetail}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-3 text-sm">
            $ ${quote.Price.toFixed(2)}
          </td>
          <td class="px-4 py-3 text-sm">
            ${quote.Date}
          </td>
          <td class="px-4 py-3 text-xs">
            <span class="px-2 py-1 font-semibold leading-tight ${statusClass} rounded-full">
              ${statusText}
            </span>
          </td>
        `;
  
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error al cargar las cotizaciones:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", loadQuotesTable);
  
