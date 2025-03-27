
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                console.log('File content:', e.target.result);
                
                const data = JSON.parse(e.target.result);
                console.log('Parsed data:', data);

                if (!data.university || !data.course || !data.students) {
                    showAlert('Invalid JSON structure. Missing required fields.', 'error');
                    return;
                }

                courseData = data;
                saveFileToStorage(file.name, data);
                displayData(data);
                displayStudents(data.students);
                updateContentVisibility();
                showAlert('Data imported successfully!', 'success');
            } catch (error) {
                console.error('Import error:', error);
                showAlert(`Error importing data: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }
});
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    if (courseData && courseData.students) {
        displayStudents(courseData.students, searchTerm);
    }
});
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;
    const name = document.getElementById('studentName').value;

    if (isEditing) {
        const studentIndex = courseData.students.findIndex(s => s.id === editingId);
        if (studentIndex !== -1) {
            if (id !== editingId && courseData.students.some(s => s.id === id)) {
                showAlert('Student ID already exists!', 'error');
                return;
            }
            courseData.students[studentIndex] = { id, name };
            showAlert('Student updated successfully!', 'success');
        }
        isEditing = false;
        editingId = null;
        document.getElementById('submitButton').textContent = 'Add Student';
    } else {
        if (courseData.students.some(s => s.id === id)) {
            showAlert('Student ID already exists!', 'error');
            return;
        }
        courseData.students.push({ id, name });
        showAlert('Student added successfully!', 'success');
    }
    if (courseData.filename) {
        saveFileToStorage(courseData.filename, courseData);
    }

    displayStudents(courseData.students);
    document.getElementById('studentForm').reset();
});
function clearData() {
    if (confirm('Are you sure you want to clear the current view? Your stored files will be preserved.')) {
        courseData = null;
        isEditing = false;
        editingId = null;
        
        document.getElementById('studentForm').reset();
        document.getElementById('searchInput').value = '';
        
        updateContentVisibility();
        showAlert('Current view has been cleared!', 'success');
        
        const fileCards = document.querySelectorAll('.file-card');
        fileCards.forEach(card => card.classList.remove('selected'));
    }
}
function exportData() {
    if (!courseData) {
        showAlert('No data to export!', 'error');
        return;
    }

    const dataStr = JSON.stringify(courseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'course_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showAlert('Data exported successfully!', 'success');
}
function editStudent(id) {
    const student = courseData.students.find(s => s.id === id);
    if (student) {
        isEditing = true;
        editingId = id;
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentName').value = student.name;
        document.getElementById('submitButton').textContent = 'Update Student';
        showAlert('Editing student...', 'success');
    }
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        courseData.students = courseData.students.filter(student => student.id !== id);
        if (courseData.filename) {
            saveFileToStorage(courseData.filename, courseData);
        }
        
        displayStudents(courseData.students);
        showAlert('Student deleted successfully!', 'success');
    }
}
window.onload = function() {
    const files = getStoredFiles();
    displayFileList();
    updateContentVisibility();
    
    if (Object.keys(files).length > 0 && !courseData) {
        const firstFileName = Object.keys(files)[0];
        loadStoredFile(firstFileName);
    }
};