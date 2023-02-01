async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function renderSummary() {
    tasksProgress = document.getElementById('tasksProgress');
    tasksAwaitingFeedback = document.getElementById('tasksAwaitingFeedback');
    tasksDone = document.getElementById('tasksDone');
    tasksTodo = document.getElementById('tasksTodo');
    displayInfo();
    defineCurrentUser();
    greetUser();
}

let tasksProgress;
let tasksAwaitingFeedback;
let tasksDone;
let tasksTodo;
let currentUserName;

function defineCurrentUser() {
    currentUser = localStorage.getItem('user');
    currentUserObject = JSON.parse(currentUser)
    currentUserName = currentUserObject[0]['name'];
}

function greetUser() {
    document.getElementById('greetingName').innerHTML = `${currentUserName}`;
}

function displayInfo() {
    document.getElementById('tasksTotal').innerHTML = tasks.length;
    filterInProgress();
    filterAwaitingFeedback();
    filterDone();
    filterTodo();
    showDeadline();
}

function filterDone() {
    let filteredtasksDone = tasks.filter(function(task) {
        return task.status === '4';
    });
    if (filteredtasksDone.length === 0) {
        tasksDone.innerHTML = 0;
    } else {
        tasksDone.innerHTML = filteredtasksDone.length;
    }
}

function filterTodo() {
    let filteredTodo = tasks.filter(function(task) {
        return task.status === '1';
    });
    if (filteredTodo.length === 0) {
        tasksTodo.innerHTML = 0;
    } else {
        tasksTodo.innerHTML = filteredTodo.length;
    }
}

function filterAwaitingFeedback() {
    let filteredAwaitingFeedback = tasks.filter(function(task) {
        return task.status === '3';
    });
    if (filteredAwaitingFeedback.length === 0) {
        tasksAwaitingFeedback.innerHTML = 0;
    } else {
        tasksAwaitingFeedback.innerHTML = filteredAwaitingFeedback.length;
    }
}

function filterInProgress() {
    let filteredTasksProgress = tasks.filter(function(task) {
        return task.status === '2';
    });
    if (filteredTasksProgress.length === 0) {
        tasksProgress.innerHTML = 0;
    } else {
        tasksProgress.innerHTML = filteredTasksProgress.length;
    }
}

function showDeadline() {
    const sortafterDate = tasks.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    })
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    let closestDate = new Date(sortafterDate[sortafterDate.length - 1].due_date);
    let closestDateMonth = months[closestDate.getMonth()];
    let closestDateDayString = closestDate.toDateString()
    let closestDateDay = closestDateDayString.substring(8, 10)
    let closestDateYear = closestDate.getFullYear();

    document.getElementById('displayDate').innerHTML = `${closestDateMonth} ${closestDateDay}, ${closestDateYear}`;
    showPriority(sortafterDate);
}

function showPriority(sortafterDate) {
    let prio = sortafterDate[sortafterDate.length - 1].priority
    let imgPrio;
    let colorBackground;
    if (prio === 'M') {
        prio = "Medium"
        imgPrio = "../assets/img/medium_clicked_task.png"
        colorBackground = "#FFA800"
    } else if (prio === 'L') {
        prio = "Low"
        imgPrio = "../assets/img/low_clicked_task.png"
        colorBackground = "#7AE229"
    } else if (prio === 'H') {
        prio = "Urgent"
        imgPrio = "../assets/img/urgent_clicked_task.png"
        colorBackground = "#FF3D00"
    }
    document.getElementById('boxPrioImg').style.backgroundColor = colorBackground
    document.getElementById('prioImg').src = imgPrio
    document.getElementById('urgencyText').innerHTML = prio
}