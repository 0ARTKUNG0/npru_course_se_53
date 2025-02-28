function divideIntoGroups(numGroups) {
    if (!courseData || !courseData.students || courseData.students.length === 0) {
        showAlert('No students available to group!', 'error');
        return;
    }

    numGroups = parseInt(numGroups);
    if (numGroups < 2 || numGroups > courseData.students.length) {
        showAlert('Invalid number of groups!', 'error');
        return;
    }

    const shuffledStudents = [...courseData.students].sort(() => Math.random() - 0.5);
    const studentsPerGroup = Math.ceil(shuffledStudents.length / numGroups);
    const groups = [];

    for (let i = 0; i < numGroups; i++) {
        const start = i * studentsPerGroup;
        const end = Math.min(start + studentsPerGroup, shuffledStudents.length);
        if (start < shuffledStudents.length) {
            groups.push(shuffledStudents.slice(start, end));
        }
    }

    courseData.groups = groups;
    currentGroups = groups;

    displayGroups(groups);
    
    if (courseData.filename) {
        saveFileToStorage(courseData.filename, courseData);
        showAlert('Groups created and saved!', 'success');
    }
}

function displayGroups(groups) {
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '<h2>Student Groups</h2>';

    groups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.className = 'group-card';
        
        let groupHtml = `
            <h3>Group ${index + 1}</h3>
            <div class="group-members">
        `;

        group.forEach(student => {
            groupHtml += `
                <div class="group-member">
                    <strong>${student.id}</strong> - ${student.name}
                </div>
            `;
        });

        groupHtml += '</div>';
        groupElement.innerHTML = groupHtml;
        studentsList.appendChild(groupElement);
    });

    document.getElementById('studentForm').style.display = 'none';
    document.querySelector('.view-toggle-btn').style.display = 'inline-block';
}

function toggleView() {
    if (!courseData) return;

    const studentsList = document.getElementById('studentsList');
    const submitButton = document.getElementById('submitButton').parentElement;
    const searchBox = document.querySelector('.search-box');

    if (studentsList.querySelector('.group-card')) {
        displayStudents(courseData.students);
        submitButton.style.display = 'flex';
        searchBox.style.display = 'block';
        document.querySelector('.view-toggle-btn').textContent = 'Show Groups';
    } else {
        if (courseData.groups) {
            displayGroups(courseData.groups);
            submitButton.style.display = 'none';
            searchBox.style.display = 'none';
            document.querySelector('.view-toggle-btn').textContent = 'Show Students';
        } else {
            showAlert('Please create groups first!', 'error');
        }
    }
}