function uploadFile() {
    const file = fileInput.files[0];
    
    if (!file) {
        showError('Por favor selecciona un archivo');
        return;
    }
    
    hideAll();
    loading.classList.remove('hidden');
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/upload/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        return response.json();
    })
    .then(data => {
        loading.classList.add('hidden');
        
        if (data.error) {
            showError(data.error);
        } else {
            displayData(data);
        }
    })
    .catch(err => {
        loading.classList.add('hidden');
        showError('Error al procesar el archivo: ' + err.message);
    });
}