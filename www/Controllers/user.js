async function signIn(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    try {
        const response = await fetch(loginUser_route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        // Verifica si la respuesta no es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Correo o contraseña incorrectos");
        }

        // Obtén los datos de la respuesta
        const result = await response.json();

        // Almacena los datos en localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('email', result.email);
        localStorage.setItem('fullName', result.fullName);

        // Verifica el nivel de cuenta y redirige al usuario
        const role = parseInt(result.role);
        if (role === 1) {
            window.location.href = './Views/index.html';
        } else if (role === 2) {
            window.location.href = './Views/index.html';
        } else {
            throw new Error("Nivel de cuenta desconocido");
        }
    } catch (error) {
        // Muestra un mensaje de error si ocurre
        console.error('Error al iniciar sesión:', error.message);
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            errorMsg.classList.add('hidden');
            }, 5000);
    }
}

async function signUp(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const role = 2;
    
    if (password !== password2) {
        const errorMsg = document.getElementById('error-msg');
        errorMsg.textContent = "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.";
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 5000);
        return;
    }
  
    const response = await fetch(signupUser_route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullName,
            email,
            password,
            role
        })
    });
  
    const result = await response.text();
  
    if (response.ok) {
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = "Cuenta creada exitosamente";
        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    } else {
        const errorMsg = document.getElementById('error-msg');
        errorMsg.textContent = "Ya existe una cuenta con el correo que estás ingresando.";
        errorMsg.classList.remove('hidden');
        setTimeout(() => {
            errorMsg.classList.add('hidden');
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
const token = localStorage.getItem('fullName');
const clientNameElement = document.getElementById('UserName');
clientNameElement.textContent = `Hola, ${token}`
})

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializa contadores para cada estado en 0
        let inProgressCount = 0;
        let pendingCount = 0;
        let notApprovedCount = 0;
        let approvedCount = 0;

        // Realiza la solicitud para obtener las cotizaciones
        const quotesResponse = await fetch(allQuotes_route);
        const quotes = await quotesResponse.json();

        // Recorre las cotizaciones y cuenta cada estado
        quotes.forEach(quote => {
            switch (quote.Status) {
                case 1:
                    inProgressCount++;
                    break;
                case 2:
                    pendingCount++;
                    break;
                case 3:
                    notApprovedCount++;
                    break;
                case 4:
                    approvedCount++;
                    break;
                default:
                    console.warn("Estado desconocido:", quote.Status);
            }
        });

        // Actualiza el contenido de los elementos HTML con los contadores, mostrando 0 si no hay datos
        document.getElementById("inprogress").textContent = inProgressCount;
        document.getElementById("pending").textContent = pendingCount;
        document.getElementById("not-approved").textContent = notApprovedCount;
        document.getElementById("approved").textContent = approvedCount;
    } catch (error) {
        console.error("Error al cargar y contar cotizaciones:", error);

        // Si hay un error en la solicitud, asegúrate de mostrar 0 en cada elemento
        document.getElementById("inprogress").textContent = 0;
        document.getElementById("pending").textContent = 0;
        document.getElementById("not-approved").textContent = 0;
        document.getElementById("approved").textContent = 0;
    }
});
