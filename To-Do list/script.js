const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const body = document.getElementById('page-body');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        themeToggle.textContent = 'Switch to Light Mode';
        localStorage.setItem('darkMode', 'true');
    } else {
        body.classList.remove('dark-mode');
        themeToggle.textContent = 'Switch to Dark Mode';
        localStorage.setItem('darkMode', 'false');
    }
}

function loadTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setTheme(isDarkMode);
}

function toggleTheme() {
    const isDarkMode = body.classList.contains('dark-mode');
    setTheme(!isDarkMode);
}

themeToggle.addEventListener('click', toggleTheme);

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = ''; 

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        
        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.classList.add('task-text');

        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status');
        
        if (task.completed) {
            statusSpan.textContent = 'Completed';
            statusSpan.classList.add('status-completed');
        } else {
            statusSpan.textContent = 'Pending';
            statusSpan.classList.add('status-pending');
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = task.completed ? 'Mark Pending' : 'Mark Complete';
        toggleBtn.classList.add('toggle-btn');
        
        toggleBtn.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed; 
            saveTasks(); 
            renderTasks(); 
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete'; 
        deleteBtn.classList.add('delete-btn');
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            tasks.splice(index, 1); 
            saveTasks();
            renderTasks();
        });

        taskContent.appendChild(taskText);
        taskContent.appendChild(statusSpan);
        listItem.appendChild(taskContent);
        listItem.appendChild(toggleBtn);
        listItem.appendChild(deleteBtn);
        
        taskList.appendChild(listItem);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({ text: text, completed: false });
        taskInput.value = ''; 
        saveTasks();
        renderTasks();
    }
}

addButton.addEventListener('click', addTask);

loadTheme();
renderTasks();