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
    isAddClientModalOpen: false,
    isEditClientModalOpen: false,
    isDeleteClientModalOpen: false,
    editClientId: null,
    editClientCompanyName: '',
    editClientManager: '',
    editClientEmail: '',
    editClientPhoneNumber: '',
    editClientFileInput: '',
    editClientFileName: '',
    openModal() {
      this.isModalOpen = true;
      this.trapCleanup = focusTrap(document.querySelector('#modal'));
    },
    closeModal() {
      this.isModalOpen = false;
      document.getElementById('nombreClase').value = '';
    },
    openAddClientModal() {
      this.isAddClientModalOpen = true;
    },
    closeAddClientModal() {
      this.isAddClientModalOpen = false;
      document.getElementById('companyName').value = '';
      document.getElementById('manager').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phoneNumber').value = '';
      document.getElementById('file-input').value = '';
      document.getElementById('file-name').value = '';
    },
    async openEditClientModal(clientId) {
      this.editClientId = clientId;
      const response = await fetch(allClients_route);
      
      if (response.ok) {
        const clients = await response.json();
        
        const client = clients.find(c => c.Id === clientId);
        
        if (client) {
          this.editClientCompanyName = client.CompanyName;
          this.editClientManager = client.Manager;
          this.editClientEmail = client.Email; // Guarda el correo actual antes de editarlo
          this.previousEmail = client.Email;   // Almacena el correo anterior para manejar el cambio de imagen
          this.editClientPhoneNumber = client.PhoneNumber;
          
          this.isEditClientModalOpen = true;
        } else {
          console.error('Client not found');
        }
      } else {
        console.error('Failed to fetch clients');
      }
    },
    closeEditClientModal() {
      this.isEditClientModalOpen = false;
    },
    async handleEditClient(event) {
      event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    
      const client = {
        Id: this.editClientId,
        CompanyName: this.editClientCompanyName,
        Manager: this.editClientManager,
        Email: this.editClientEmail,
        PhoneNumber: this.editClientPhoneNumber,
        Role: 1
      };
    
      // Obtener el cliente actual
      const currentResponse = await fetch(allClients_route);
      const clients = await currentResponse.json();
      const currentClient = clients.find(c => c.Id === this.editClientId);
    
      const fileInput = document.getElementById('file-input');
      const newImageFile = fileInput.files.length > 0; // Verificar si hay nueva imagen
    
      // Si no hay cambios y no se ha subido una nueva imagen, mostrar mensaje de error
      if (
        currentClient.CompanyName === client.CompanyName &&
        currentClient.Manager === client.Manager &&
        currentClient.Email === client.Email &&
        currentClient.PhoneNumber === client.PhoneNumber &&
        !newImageFile
      ) {
        const cambiarErrorMsg = document.getElementById('cambiar-error-msg');
        cambiarErrorMsg.textContent = "No se han realizado cambios";
        cambiarErrorMsg.classList.remove('hidden');
    
        setTimeout(() => {
          cambiarErrorMsg.classList.add('hidden');
        }, 5000);
        return;
      }
    
      // Si el correo ha cambiado, eliminar la imagen anterior y subir la nueva (si aplica)
      if (currentClient.Email !== client.Email || newImageFile) {
        const oldFileName = `${currentClient.Email}.jpg`;
    
        // Eliminar la imagen anterior
        await fetch(deleteImg_route + oldFileName, {

          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName: oldFileName }),
        });
    
        // Si hay una nueva imagen, súbela con el nuevo correo
        if (newImageFile) {
          const formData = new FormData();
          formData.append('file', fileInput.files[0], `${client.Email}.jpg`); // Usa el nuevo correo para la imagen
    
          await fetch(uploadImg_route, {
            method: 'POST',
            body: formData,
          });
          // Guardar en localStorage que los cambios fueron exitosos
          localStorage.setItem('editSuccess', 'true');
          location.reload();
        }
      }
    
      // Actualiza los datos del cliente (si hubo cambios)
      await fetch(editClient_route + client.Id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });
      this.closeEditClientModal();
      // Mostrar mensaje de éxito
      const successMsg = document.getElementById('editar-success-message');
      successMsg.textContent = "Cambios guardados exitosamente";
      successMsg.classList.remove('hidden');
    
      setTimeout(() => {
        successMsg.classList.add('hidden');
      }, 5000);
      fetchClients();
    },       
    openDeleteClientModal(clientId) {
      this.deleteClientId = clientId;
      this.isDeleteClientModalOpen = true;
    },
    closeDeleteClientModal() {
      this.isDeleteClientModalOpen = false;
      this.deleteClientId = null;
    },
    async handleDeleteClient() {
      if (!this.deleteClientId) {
        return;
      }

      const response = await fetch(deleteClient_route + this.deleteClientId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.closeDeleteClientModal();
        // Mostrar mensaje de éxito temporalmente
        const eliminarsuccessMessage = document.getElementById('eliminar-success-message');
        eliminarsuccessMessage.textContent = "El usuario se elimino correctamente";
        eliminarsuccessMessage.classList.remove('hidden');

        // Ocultar el mensaje de éxito después de 30 segundos
        setTimeout(() => {
            eliminarsuccessMessage.classList.add('hidden');
        }, 5000);

        fetchClients();
      }
    },
    logout() {
      logout();
    },
  };
}
