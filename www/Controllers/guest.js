async function addGuest(event) {
    event.preventDefault();

    const companyName = document.getElementById('companyName').value;
    const manager = document.getElementById('manager').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    const clientData = {
        companyName: companyName,
        manager: manager,
        email: email,
        phoneNumber: phoneNumber,
        role: 2,
        date: new Date().toLocaleDateString('es-ES')
    };

    try {
        const response = await fetch(addGuest_route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            const errorMsg = document.getElementById('error-msg');
            errorMsg.textContent = "Ya existe un cliente con el correo que estás ingresando";
            errorMsg.classList.remove('hidden');

            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
            return;
        }

        const result = await response.json();
        console.log('Cotización registrada:', result);

        const ClientId = result.ClientId;
        window.location.href = `cotizacion-vista1.html?clientId=${ClientId}`;

    } catch (error) {
        document.getElementById('error-msg').innerText = error.message;
        document.getElementById('error-msg').classList.remove('hidden');
    }
}