// UI Functions
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

function updateContentVisibility() {
    const mainContent = document.getElementById('mainContent');
    const noDataMessage = document.getElementById('noDataMessage');
    const files = getStoredFiles();
    
    if (courseData) {
        mainContent.style.display = 'block';
        noDataMessage.style.display = 'none';
    } else {
        mainContent.style.display = 'none';
        noDataMessage.style.display = Object.keys(files).length === 0 ? 'block' : 'none';
    }
}

function displayData(data) {
    const studentInfoDiv = document.getElementById('studentInfo');
    studentInfoDiv.innerHTML = `
        <h2>${data.university}</h2>
        <h3>${data.course.name}</h3>
        <p>Section: ${data.course.section}</p>
        <p>Instructor: ${data.course.instructor}</p>
        <p>Schedule: ${data.course.schedule.day} ${data.course.schedule.time}</p>
        <p>Room: ${data.course.schedule.room}</p>
    `;
}

function displayFileList() {
    const fileList = document.getElementById('fileList');
    const files = getStoredFiles();
    fileList.innerHTML = '';

    if (Object.keys(files).length === 0) {
        fileList.innerHTML = '<p>No stored files</p>';
        return;
    }

    Object.entries(files).forEach(([filename, fileInfo]) => {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        const date = new Date(fileInfo.timestamp).toLocaleString();
        
        fileCard.innerHTML = `
            <h3>${filename}</h3>
            <p>Imported: ${date}</p>
            <div class="file-actions">
                <button class="load-btn" onclick="loadStoredFile('${filename}')">Load</button>
                <button class="delete-file-btn" onclick="deleteStoredFile('${filename}')">Delete</button>
            </div>
        `;
        fileList.appendChild(fileCard);
    });
}

function displayStudents(students, searchTerm = '') {
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    students.forEach(student => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const idMatch = student.id.toLowerCase().includes(searchLower);
            const nameMatch = student.name.toLowerCase().includes(searchLower);
            
            if (!idMatch && !nameMatch) return;
        }

        const studentElement = document.createElement('div');
        studentElement.className = 'student-item';

        let displayId = student.id;
        let displayName = student.name;
        if (searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            displayId = student.id.replace(regex, '<span class="highlight">$1</span>');
            displayName = student.name.replace(regex, '<span class="highlight">$1</span>');
        }

        studentElement.innerHTML = `
            <div>
                <strong>${displayId}</strong> - ${displayName}
            </div>
            <div class="action-buttons">
                <button class="edit-btn" onclick="editStudent('${student.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
            </div>
        `;
        studentsList.appendChild(studentElement);
    });
}