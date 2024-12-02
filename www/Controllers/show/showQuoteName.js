document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quoteId = urlParams.get('quoteId');

    if (!quoteId) {
        document.getElementById('cotName').textContent = 'Client ID not found';
        return;
    }

    try {
        const response = await fetch(allQuotes_route);
        if (!response.ok) {
            throw new Error('Failed to fetch clients');
        }

        const quotes = await response.json();

        const quote = quotes.find(q => q.Id === quoteId);

        const quoteNameElement = document.getElementById('cotName');
        if (quote) {
            quoteNameElement.textContent = `No. Cotización: ${quote.QuoteName}`;
        } else {
            quoteNameElement.textContent = 'Quote not found';
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        document.getElementById('cotName').textContent = 'Error fetching client data';
    }
});