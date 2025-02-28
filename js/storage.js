let courseData = null;
let isEditing = false;
let editingId = null;
let currentGroups = null;

function saveFileToStorage(filename, data) {
    const files = getStoredFiles();
    files[filename] = {
        data: data,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('storedFiles', JSON.stringify(files));
    displayFileList();
}

function getStoredFiles() {
    const files = localStorage.getItem('storedFiles');
    return files ? JSON.parse(files) : {};
}

function deleteStoredFile(filename) {
    const files = getStoredFiles();
    delete files[filename];
    localStorage.setItem('storedFiles', JSON.stringify(files));
    displayFileList();
}

function loadStoredFile(filename) {
    const files = getStoredFiles();
    if (files[filename]) {
        courseData = files[filename].data;
        displayData(courseData);
        displayStudents(courseData.students);
        updateContentVisibility();
        showAlert('File loaded successfully!', 'success');
        
        const fileCards = document.querySelectorAll('.file-card');
        fileCards.forEach(card => {
            if (card.querySelector('h3').textContent === filename) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }
}