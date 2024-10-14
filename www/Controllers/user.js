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
