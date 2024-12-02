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
            this.editClientEmail = client.Email;
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
          Role: 2
        };
      
        // Obtener el cliente actual
        const currentResponse = await fetch(allClients_route);
        const clients = await currentResponse.json();
        const currentClient = clients.find(c => c.Id === this.editClientId);
      
        if (
          currentClient.CompanyName === client.CompanyName &&
          currentClient.Manager === client.Manager &&
          currentClient.Email === client.Email &&
          currentClient.PhoneNumber === client.PhoneNumber
        ) {
          const cambiarErrorMsg = document.getElementById('cambiar-error-msg');
          cambiarErrorMsg.textContent = "No se han realizado cambios";
          cambiarErrorMsg.classList.remove('hidden');
      
          setTimeout(() => {
            cambiarErrorMsg.classList.add('hidden');
          }, 5000);
          return;
        }
      
        await fetch(editClient_route + client.Id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(client),
        });
        this.closeEditClientModal();

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
  