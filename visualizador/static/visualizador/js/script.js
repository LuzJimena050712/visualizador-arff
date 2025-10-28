const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const fileContent = document.getElementById('fileContent');
const dataTable = document.getElementById('dataTable');

fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileName.textContent = this.files[0].name;
    } else {
        fileName.textContent = 'Sin archivos seleccionados';
    }
});

uploadBtn.addEventListener('click', uploadFile);

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

function displayData(data) {
    document.getElementById('totalRows').textContent = data.total_rows;
    document.getElementById('totalCols').textContent = data.total_cols;
    
    let html = '<thead><tr>';
    data.columns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    data.data.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody>';
    
    dataTable.innerHTML = html;
    fileContent.classList.remove('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideAll() {
    loading.classList.add('hidden');
    error.classList.add('hidden');
    fileContent.classList.add('hidden');
}