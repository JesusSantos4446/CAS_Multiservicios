async function addClient(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    const companyName = document.getElementById('companyName').value;
    const manager = document.getElementById('manager').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file || file.type !== 'image/jpeg') {
        // Mostrar mensaje de error
        const errorMsg = document.getElementById('error-msg');
        errorMsg.textContent = "Favor de seleccionar un archivo JPG";
        errorMsg.classList.remove('hidden');

        // Ocultar el mensaje de éxito después de 30 segundos
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 5000);
        return;
    }

    const clientData = {
        companyName: companyName,
        manager: manager,
        email: email,
        phoneNumber: phoneNumber,
        role: 1, // Cambia esto según sea necesario
        date: new Date().toLocaleDateString('es-ES') // Fecha actual en formato dd/MM/yyyy
    };

    try {
        // Envío de datos del cliente a la API
        const response = await fetch(addClient_route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            // Mostrar mensaje de error
            const errorMsg = document.getElementById('error-msg');
            errorMsg.textContent = "Ya existe un usuario con el correo que estás ingresando";
            errorMsg.classList.remove('hidden');

            // Ocultar el mensaje de éxito después de 30 segundos
            setTimeout(() => {
                errorMsg.classList.add('hidden');
            }, 5000);
            return;
        }

        // El cliente fue añadido correctamente, ahora subir la imagen
        const formData = new FormData();
        // Renombrar la imagen usando el email del cliente
        formData.append('file', new File([file], `${email}.jpg`, { type: 'image/jpeg' }));

        const imageResponse = await fetch(uploadImg_route, {
            method: 'POST',
            body: formData,
        });

        if (!imageResponse.ok) {
            throw new Error('Error al subir la imagen');
        }

        const modalData = document.querySelector('[x-data]').__x.$data;
            modalData.isAddClientModalOpen = false;

            // Vaciar los campos del formulario
            document.getElementById('companyName').value = '';
            document.getElementById('manager').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phoneNumber').value = '';
            document.getElementById('file-input').value = '';
            document.getElementById('file-name').value = '';

            // Mostrar mensaje de éxito temporalmente
            const successMessage = document.getElementById('success-message');
            successMessage.textContent = "Usuario creado exitosamente";
            successMessage.classList.remove('hidden');

            // Ocultar el mensaje de éxito después de 30 segundos
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);

            fetchClients();
    } catch (error) {
        document.getElementById('error-msg').innerText = error.message;
        document.getElementById('error-msg').classList.remove('hidden');
    }
}

function handleFileSelect(event) {
    const fileInput = event.target;
    const fileNameInput = document.getElementById('file-name');

    // Verifica si se seleccionó un archivo
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        // Muestra el nombre del archivo en el input de texto
        fileNameInput.value = file.name;
    }
}

