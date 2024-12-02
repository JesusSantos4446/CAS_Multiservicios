document.addEventListener('DOMContentLoaded', function() {
  // Verificar si hay un mensaje de éxito guardado en localStorage
  const successMsg = document.getElementById('editar-success-message');
  
  if (successMsg && localStorage.getItem('editSuccess') === 'true') {
    successMsg.textContent = "Cambios guardados exitosamente";
    successMsg.classList.remove('hidden');

    // Limpiar localStorage después de mostrar el mensaje
    localStorage.removeItem('editSuccess');

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      successMsg.classList.add('hidden');
    }, 5000);
  }
});
