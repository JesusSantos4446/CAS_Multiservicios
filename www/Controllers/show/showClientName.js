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
        document.getElementById('ClientName').textContent = 'Error fetching client data';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');

    if (!clientId) {
        document.getElementById('cotClientId').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allClients_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const clients = await response.json();

        const client = clients.find(c => c.Id === clientId);

        const clientNameElement = document.getElementById('cotClientId');
        if (client) {
            if (client.Role === 1) {
                clientNameElement.textContent = `Cotización para: ${client.CompanyName}`;
            } else {
                clientNameElement.textContent = `Cotización para: ${client.Manager}`;
            }
        } else {
            clientNameElement.textContent = 'Client not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('cotClientId').textContent = 'Error fetching client data';
    }
});
