let clients = [];
const rowsPerPage = 10;
let currentPage = 1;
let sortColumn = '';
let sortOrder = 'ascending';

async function fetchClients() {
  try {
    const response = await fetch(allClients_route);
    const data = await response.json();

    clients = data.filter(client => client.Role === 2);

    displayPage(currentPage);
    createPaginationControls();
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
}

function displayPage(page) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = page * rowsPerPage;
  const clientsToDisplay = clients.slice(startIndex, endIndex);

  const tbody = document.getElementById('allClients');
  tbody.innerHTML = '';

  clientsToDisplay.forEach(client => {

    const row = `
      <tr class="text-gray-700 dark:text-gray-400">
        <td class="px-4 py-3">
          <div class="flex items-center text-sm">
            <div class="relative w-8 h-8 mr-3 rounded-full md:block">
              <img class="object-cover w-full h-full rounded-full" src="../public/img/guess.jpg" alt="" loading="lazy" />
              <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
            </div>
            <div>
              <p class="font-semibold">${client.CompanyName}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-sm">${client.Manager}</td>
        <td class="px-4 py-3 text-sm">${client.Email}</td>
        <td class="px-4 py-3 text-sm">${client.PhoneNumber}</td>
        <td class="px-4 py-3">
          <div class="flex items-center space-x-4 text-sm">
            <button @click="openEditClientModal('${client.Id}')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Edit">
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
            </button>
            <button @click="openDeleteClientModal('${client.Id}')" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Delete">
            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            </button>
        </div>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });

  document.getElementById('rangeDisplay').textContent = `${startIndex + 1}-${Math.min(endIndex, clients.length)} de ${clients.length}`;
}

function createPaginationControls() {
  const totalPages = Math.ceil(clients.length / rowsPerPage);
  const ul = document.getElementById('paginationControls');
  ul.innerHTML = '';

  const prevButton = document.createElement('li');
  prevButton.innerHTML = `
    <button
                         class="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                         aria-label="Previous"
                       >
                         <svg
                           class="w-4 h-4 fill-current"
                           aria-hidden="true"
                           viewBox="0 0 20 20"
                         >
                           <path
                             d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                             clip-rule="evenodd"
                             fill-rule="evenodd"
                           ></path>
                         </svg>
                       </button>
  `;
  ul.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('li');
    pageButton.innerHTML = `<button class="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple" onclick="changePage(${i})">${i}</button>`;
    ul.appendChild(pageButton);
  }

  const nextButton = document.createElement('li');
  nextButton.innerHTML = `
    <button
                         class="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                         aria-label="Next"
                       >
                         <svg
                           class="w-4 h-4 fill-current"
                           aria-hidden="true"
                           viewBox="0 0 20 20"
                         >
                           <path
                             d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                             clip-rule="evenodd"
                             fill-rule="evenodd"
                           ></path>
                         </svg>
                       </button>
  `;
  ul.appendChild(nextButton);
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(clients.length / rowsPerPage)) return;
  currentPage = page;
  displayPage(page);
}

fetchClients();