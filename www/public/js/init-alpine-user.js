function data() {
  function getThemeFromLocalStorage() {
    const storedTheme = window.localStorage.getItem('dark');
    if (storedTheme !== null) {
      return JSON.parse(storedTheme);
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function setThemeToLocalStorage(value) {
    window.localStorage.setItem('dark', value);
  }

  return {
    dark: getThemeFromLocalStorage(),
    toggleTheme() {
      this.dark = !this.dark;
      setThemeToLocalStorage(this.dark);
    },
    isSideMenuOpen: false,
    toggleSideMenu() {
      this.isSideMenuOpen = !this.isSideMenuOpen;
    },
    closeSideMenu() {
      this.isSideMenuOpen = false;
    },
    isNotificationsMenuOpen: false,
    toggleNotificationsMenu() {
      this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
    },
    closeNotificationsMenu() {
      this.isNotificationsMenuOpen = false;
    },
    isProfileMenuOpen: false,
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    closeProfileMenu() {
      this.isProfileMenuOpen = false;
    },
    isPagesMenuOpen: false,
    togglePagesMenu() {
      this.isPagesMenuOpen = !this.isPagesMenuOpen;
    },
    isModalOpen: false,
    trapCleanup: null,
    isAddUserModalOpen: false,
    isEditUserModalOpen: false,
    isDeleteUserModalOpen: false,
    isJoinClassModalOpen: false,
    editUserId: null,
    editUsername: '',
    editUserEmail: '',
    editUserAccountLevel: '1', // Por defecto es Administrador
    openModal() {
      this.isModalOpen = true;
      this.trapCleanup = focusTrap(document.querySelector('#modal'));
    },
    closeModal() {
      this.isModalOpen = false;
      document.getElementById('nombreClase').value = '';
    },
    openAddUserModal() {
      this.isAddUserModalOpen = true;
    },
    closeAddUserModal() {
      this.isAddUserModalOpen = false;
      document.getElementById('fullName').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
      document.getElementById('confirmPassword').value = '';
      document.getElementById('accountLevel').value = 'Selecciona....';
    },
    async openEditUserModal(userId) {
      this.editUserId = userId;
      const response = await fetch(showUserWithId_route + userId);
      const user = await response.json();
      this.editUsername = user.FullName;
      this.editUserEmail = user.Email;
      this.editUserAccountLevel = user.Role.toString(); // Asegúrate de que el nivel se mantenga como string
      this.isEditUserModalOpen = true;
    },    
    closeEditUserModal() {
      this.isEditUserModalOpen = false;
    },
    async handleEditUser(event) {
      event.preventDefault(); // Para evitar el comportamiento por defecto del formulario
      const user = {
        Id: this.editUserId,
        FullName: this.editUsername,
        Email: this.editUserEmail,
        Role: parseInt(this.editUserAccountLevel, 10)
      };

      // Verifica si la información no ha cambiado
      const currentResponse = await fetch(showUserWithId_route + this.editUserId);
      const currentUser = await currentResponse.json();

      if (
        currentUser.FullName === user.FullName &&
        currentUser.Email === user.Email &&
        currentUser.Role === user.Role
      ) {
        // Mostrar mensaje de error
        const cambiarerrorMsg = document.getElementById('cambiar-error-msg');
        cambiarerrorMsg.textContent = "Favor de modificar el usuario, no se han realizado cambios";
        cambiarerrorMsg.classList.remove('hidden');

        // Ocultar el mensaje de éxito después de 30 segundos
        setTimeout(() => {
            cambiarerrorMsg.classList.add('hidden');
        }, 5000);
        return; // Detener el proceso de actualización
      }

      const response = await fetch(editUser_route + this.editUserId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        this.closeEditUserModal();
        // Mostrar mensaje de éxito temporalmente
        const editarsuccessMessage = document.getElementById('editar-success-message');
        editarsuccessMessage.textContent = "Usuario editado exitosamente";
        editarsuccessMessage.classList.remove('hidden');

        // Ocultar el mensaje de éxito después de 30 segundos
        setTimeout(() => {
            editarsuccessMessage.classList.add('hidden');
        }, 10000);

        mostrarUsuarios();
      } else {
        // Mostrar mensaje de error
        const editarerrorMsg = document.getElementById('editar-error-msg');
        editarerrorMsg.textContent = "Ya existe un usuario con el correo que estás ingresando";
        editarerrorMsg.classList.remove('hidden');

        // Ocultar el mensaje de éxito después de 30 segundos
        setTimeout(() => {
            editarerrorMsg.classList.add('hidden');
        }, 10000);
      }
    },
    openDeleteUserModal(userId) {
      this.deleteUserId = userId;
      this.isDeleteUserModalOpen = true;
    },
    closeDeleteUserModal() {
      this.isDeleteUserModalOpen = false;
      this.deleteUserId = null; // Limpiar el ID al cerrar el modal
    },
    async handleDeleteUser() {
      if (!this.deleteUserId) {
        alert('No se ha seleccionado ningún usuario para eliminar');
        return;
      }

      const response = await fetch(deleteUser_route + this.deleteUserId, {
        method: 'DELETE',
        headers: {
        }
      });

      if (response.ok) {
        this.closeDeleteUserModal();
        // Mostrar mensaje de éxito temporalmente
        const eliminarsuccessMessage = document.getElementById('eliminar-success-message');
        eliminarsuccessMessage.textContent = "Usuario eliminado exitosamente";
        eliminarsuccessMessage.classList.remove('hidden');

        // Ocultar el mensaje de éxito después de 30 segundos
        setTimeout(() => {
            eliminarsuccessMessage.classList.add('hidden');
        }, 10000);

        mostrarUsuarios();
      }
    },
    openJoinClassModal() {
      this.isJoinClassModalOpen = true;
    },
    closeJoinClassModal() {
      this.isJoinClassModalOpen = false;
      document.getElementById('codigoClase').value = '';
    },
    logout() {
      logout();
    },
  };
}