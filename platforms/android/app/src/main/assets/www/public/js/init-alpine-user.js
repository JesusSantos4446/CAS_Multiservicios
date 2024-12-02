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
      editUserAccountLevel: '1',
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
        this.editUsername = user.NombreCompleto;
        this.editUserEmail = user.Correo;
        this.editUserAccountLevel = user.NivelCuenta.toString(); // Asegúrate de que el nivel se mantenga como string
        this.isEditUserModalOpen = true;
      },    
      closeEditUserModal() {
        this.isEditUserModalOpen = false;
      },
      async handleEditUser(event) {
        event.preventDefault();
        const user = {
          Id: this.editUserId,
          NombreCompleto: this.editUsername,
          Correo: this.editUserEmail,
          NivelCuenta: parseInt(this.editUserAccountLevel, 10)
        };
  
        const currentResponse = await fetch(showUserWithId_route + this.editUserId);
        const currentUser = await currentResponse.json();
  
        if (
          currentUser.NombreCompleto === user.NombreCompleto &&
          currentUser.Correo === user.Correo &&
          currentUser.NivelCuenta === user.NivelCuenta
        ) {
          const cambiarerrorMsg = document.getElementById('cambiar-error-msg');
          cambiarerrorMsg.textContent = "Favor de modificar el usuario, no se han realizado cambios";
          cambiarerrorMsg.classList.remove('hidden');
  
          setTimeout(() => {
              cambiarerrorMsg.classList.add('hidden');
          }, 5000);
          return;
        }
  
        const response = await fetch(editUserWithId_route + this.editUserId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(user)
        });
  
        if (response.ok) {
          this.closeEditUserModal();
          const editarsuccessMessage = document.getElementById('editar-success-message');
          editarsuccessMessage.textContent = "Usuario editado exitosamente";
          editarsuccessMessage.classList.remove('hidden');
  
          setTimeout(() => {
              editarsuccessMessage.classList.add('hidden');
          }, 10000);
  
          mostrarUsuarios();
        } else {
          const editarerrorMsg = document.getElementById('editar-error-msg');
          editarerrorMsg.textContent = "Ya existe un usuario con el correo que estás ingresando";
          editarerrorMsg.classList.remove('hidden');
  
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
  
        const response = await fetch(deleteUserWithId_route + this.deleteUserId, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token esté en localStorage
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