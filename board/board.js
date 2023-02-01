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

async function requestSubtask(subtask) {
    let subtaskId = subtask.id
    let url = "https://jonas34.pythonanywhere.com/subtasks/" + subtaskId + '/';
    await changeSubtask(subtask, url)
}

async function requestDeleteSubtask(subtask) {
    let subtaskId = subtask.id
    let url = "https://jonas34.pythonanywhere.com/subtasks/" + subtaskId + '/';
    await deleteSubtask(subtaskId, url);
}

async function requestTask(filteredTask) {
    let date = correctDate(filteredTask[0].due_date)
    filteredTask[0]['due_date'] = date;
    let urlId = filteredTask[0].id
    let url = "https://jonas34.pythonanywhere.com/todos/" + urlId + '/'
    if (filteredTask[0].status === '5') {
        await deleteToDo(filteredTask[0], url)
    } else {
        await putToDo(filteredTask[0], url)
    }
    removeDragBackground();
    renderBoard();
}

let priorities = ['Urgent', 'Medium', 'Low'];
let currentCategory = [];
let currentDraggedElement;
let selectedElement = [];
let priorityDetails;
let priorityColor;
let currentStatus;
let changedUrgency;


// Update container with Todo-Tasks based on status ('open', 'in progress', 'awaiting feedback', 'done')
function renderBoard() {
    updateHTMLOpenTasks();
    updateHTMLInProgessTasks();
    updateHTMLFeedbackTasks();
    updateHTMLClosedTasks();
}


// Update container with status == 'open'.
function updateHTMLOpenTasks() {
    let openTasks = tasks.filter((task) => {
        return task['status'] == '1'
    });
    document.getElementById('open').innerHTML = '';
    for (let index = 0; index < openTasks.length; index++) {
        const element = openTasks[index];
        let openIndex = index + "o"
        document.getElementById('open').innerHTML += generateTodoHTML(element, openIndex);
        updateToDo(element, openIndex);
    }
}

// Update container with status == 'progress'.
function updateHTMLInProgessTasks() {
    let progress = tasks.filter((task) => {
        return task['status'] == '2'
    });
    document.getElementById('progress').innerHTML = '';
    for (let index = 0; index < progress.length; index++) {
        const element = progress[index];
        let progressIndex = index + "p";
        document.getElementById('progress').innerHTML += generateTodoHTML(element, progressIndex);
        updateToDo(element, progressIndex);
    }
}

// Update container with status == 'feedback'.
function updateHTMLFeedbackTasks() {
    let feedback = tasks.filter((task) => {
        return task['status'] == '3'
    });
    document.getElementById('feedback').innerHTML = '';
    for (let index = 0; index < feedback.length; index++) {
        const element = feedback[index];
        let feedbackIndex = index + "f";
        document.getElementById('feedback').innerHTML += generateTodoHTML(element, feedbackIndex);
        updateToDo(element, feedbackIndex);
    }
}

// Update container with status == 'closed'.
function updateHTMLClosedTasks() {
    let closed = tasks.filter((task) => {
        return task['status'] == '4'
    });
    document.getElementById('closed').innerHTML = '';
    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        let closedIndex = index + "c";
        document.getElementById('closed').innerHTML += generateTodoHTML(element, closedIndex);
        updateToDo(element, closedIndex);

    }

}

function updateToDo(task, index) {
    getName(task, index);
    getSubtask(task, index);
    getPrio(task, index);
}

function getName(task, index) {
    let splitUsers = task.user.split('/');
    splitUsers.splice(-1);

    for (let i = 0; i < splitUsers.length; i++) {
        const splitUser = splitUsers[i];
        let Characters = "";
        let string = splitUser.toString();
        len = string.length

        for (let i = 0; i < len; i++) {
            if (string[i] === string[i].toUpperCase())
                Characters = Characters + string[i]
        }
        let letters = Characters.replace(/[^\w\s!?]/g, '')

        addUserToBoard(index, splitUser, i, task, letters)
    }
}

function getSubtask(task, index) {
    let TaskTotal = task.subtasks.length
    let subtaskTrue = task.subtasks.filter(subtask => {
        if (subtask.done == "true") {
            return subtask
        }
    });
    if (TaskTotal > 0) {
        document.getElementById('boxSubTask' + index).innerHTML = generateSubtasks(subtaskTrue.length, TaskTotal, index);
        let taskPercentDone = subtaskTrue.length / TaskTotal * 100;
        document.getElementById('subtaskBar' + index).style.width = taskPercentDone + '%'
    }
}

function getPrio(task, index) {
    if (task.priority === 'H') {
        document.getElementById('prio' + index).src = "../assets/img/urgent_task.png"
    } else if (task.priority === "M") {
        document.getElementById('prio' + index).src = "../assets/img/medium_task.png"
    } else if (task.priority === 'L') {
        document.getElementById('prio' + index).src = "../assets/img/low_task.png"
    }
}

function addUserToBoard(index, splitUser, i, task, letters) {
    let placeUser = 0;
    document.getElementById('checkUsers' + index).innerHTML += `<div class="todo_contact_img" id="checkUser${index}${i}">${letters[0]}${letters[1]}</div>`

    placeUser = 1.75 * i;
    if (i > 0) {
        document.getElementById('checkUser' + index + i).style.left = placeUser + 'rem'
    }
    let filteredcontacts = contacts.filter((contact) => {
        if (splitUser.includes(contact.lastName))
            return contact
    });
    document.getElementById('checkUser' + index + i).style.backgroundColor = filteredcontacts[0].color;
    document.getElementById('checkCategory' + index).style.backgroundColor = task.categories[0].color
}

function correctDate(date) {
    if (!date.includes('/')) {
        let year = date.substr(0, 4)
        let month = date.substr(5, 2)
        let day = date.substr(8, 2)
        date = month + "/" + day + "/" + year
    }
    return date

}

// Needed to make dropping elements possible. 
function allowDrop(ev) {
    ev.preventDefault();
}

// Dragging elements based on IDs. 
function startDragging(id) {
    currentDraggedElement = id;
}

// Change status when element is moved (E.g. todo-task with id 1: the status field is changed from 'open' to 'closed'.).
function moveTo(status) {
    let filteredTask = tasks.filter((task) => {
        return task['id'] === currentDraggedElement
    });
    filteredTask[0]['status'] = status;
    requestTask(filteredTask)
}



function removeDragBackground() {
    const dragBackground = document.querySelectorAll('.drag_area_highlight');
    dragBackground.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

// Change background color when element is dragged.
function highlight(id) {
    let category = document.getElementById(id).querySelector('.drag_area_highlight');
    if (category == null) {
        document.getElementById(id).innerHTML += `
        <div class="drag_area_highlight" ></div>`
    }
}

function removeHighlight(id) {
    let element = document.getElementById(id);
    element.removeChild(element.lastChild);
}

// ??? ////////////////////////////////////
// Show Task Details
function openBoardDetails(id, index) {
    document.getElementById('boardDetails').classList.remove('d_none');
    let boardContent = document.getElementById('boardContent');
    boardContent.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task['id'] == id) {
            selectedElement.push(task);
        }
    }
    let fitleredTask = selectedElement[0]

    setPriorityColor(fitleredTask);
    setPriorityDetails(fitleredTask);
    setCurrentStatus(fitleredTask);
    boardContent.innerHTML += openBoardDetailsHTML(fitleredTask);
    setSubtasks(fitleredTask, index);
    setNameDetails(fitleredTask, id);

}

function setSubtasks(fitleredTask, index) {
    for (let i = 0; i < fitleredTask['subtasks'].length; i++) {
        const subtask = fitleredTask['subtasks'][i];
        document.getElementById('place_subtasks').innerHTML += generateSubtaskDetails(fitleredTask, i, index)
    }
    for (let i = 0; i < fitleredTask['subtasks'].length; i++) {
        const subtask = fitleredTask['subtasks'][i];
        if (subtask['done'] == "true") {
            document.getElementById('subtask' + i).checked = true;
        } else {
            document.getElementById('subtask' + i).checked = false;
        }
    }
}

// Sets selected subtask to done = "true";
async function setSubtaskDone(filteredTaskId, i, index) {
    let filteredTask = tasks.filter((task) => {
        return task.id === filteredTaskId;
    });
    let subtask = filteredTask[0].subtasks[i]
    if (subtask.done !== "true") {
        subtask.done = "true";
    } else {
        subtask.done = "false";
    }
    await requestSubtask(subtask);
    checkDoneSubtasks(filteredTask[0], index)
}

function checkDoneSubtasks(filteredTask, index) {
    let amountSubtasks = filteredTask.subtasks.length;
    let finishedSubtasks = filteredTask.subtasks.filter((finSub) => {
        return finSub.done === "true"
    })
    finishedPercentage = (finishedSubtasks.length / amountSubtasks) * 100
    document.getElementById('subtaskDone' + index).innerHTML = finishedSubtasks.length
    document.getElementById('subtaskBar' + index).style.width = finishedPercentage + '%'
}

// opens window, that allows you to change task details
function changeTaskDetails(id) {
    let boardContent = document.getElementById('boardContent');
    boardContent.innerHTML = '';
    boardContent.innerHTML += changeTaskDetailsHTML(id)
}

function confirmChangedTask(id) {
    changeDate(id);
    checkFilteredTask(id);
    renderBoard();
    closeBoardDetails()
}

// checks if changes to selected task have been made
function checkFilteredTask(id) {
    let title = document.getElementById(`inputTitle${id}`);
    let description = document.getElementById(`inputDescription${id}`);
    let filteredTask = tasks.filter((task) => {
        return task.id === id;
    })
    if (title.value !== '') {
        filteredTask[0].title = title.value;
    }
    if (description.value !== '') {
        filteredTask[0].description = description.value;
    }
    if (changedDate !== undefined || changedDate !== null) {
        filteredTask[0].due_date = changedDate;
    }
    if (changedUrgency !== undefined) {
        filteredTask[0].priority = changedUrgency;
    }
    requestTask(filteredTask)
}

function getDeleteSubtask(filteredtask) {
    let subtasks = filteredtask[0].subtasks;
    /*     let filteredIdSubtasks = []; */
    subtasks.forEach((subtask) => {
        requestDeleteSubtask(subtask)
    })
}

function getDeleteTask(id) {
    let filteredTask = tasks.filter((task) => {
        return task.id === id;
    })
    filteredTask[0].status = '5'
    getDeleteSubtask(filteredTask)
    requestTask(filteredTask)
}

let changedDate;

function changeDate(id) {
    let due_date_rev = document.getElementById(`inputDate${id}`).value;
    let year = due_date_rev.substr(0, 4)
    let month = due_date_rev.substr(5, 2)
    let day = due_date_rev.substr(8, 2)
    changedDate = month + "/" + day + "/" + year
}

let arraySplitUser = [];

function setNameDetails(fitleredTask, id) {
    let splitUsers = fitleredTask['user'].split('/');
    splitUsers.splice(-1);
    arraySplitUser.push(splitUsers)
    let lettersArray = []

    for (let i = 0; i < splitUsers.length; i++) {
        const splitUser = splitUsers[i];
        let Characters = "";
        let string = splitUser.toString();
        len = string.length

        for (let i = 0; i < len; i++) {
            if (string[i] === string[i].toUpperCase())
                Characters = Characters + string[i]
        }
        letters = Characters.replace(/[^\w\s!?]/g, '')
        lettersArray.push(letters)
    }
    addUserToDetails(id, lettersArray, fitleredTask)
}

// adds small circle with initials and names of users that belong to the selected task
function addUserToDetails(id, letters, fitleredTask) {
    for (let i = 0; i < arraySplitUser[0].length; i++) {
        let element = arraySplitUser[0][i];
        element = element.replace(/\,/g, ' ');
        let filteredContact = contacts.filter((user) => {
            return element.includes(user.firstName)
        })
        document.getElementById(id).innerHTML += `<div class="assignedContact"> <div style="background-color:${filteredContact[0]['color']}" class="details_contact_img">${letters[i]}</div> <p> ${element} </div>`
    }
    arraySplitUser = [];

}

function setPriorityColor(fitleredTask) {
    if (fitleredTask['priority'] == 'M') {
        priorityColor = 'orange';
    } else if (fitleredTask['priority'] == 'L') { // Sets color for selected task depending on priority
        priorityColor = 'green';
    } else if (fitleredTask['priority'] == 'H') {
        priorityColor = 'red';
    }
}

function setPriorityDetails(fitleredTask) {
    if (fitleredTask['priority'] == 'M') {
        priorityDetails = 'Medium';
    } else if (fitleredTask['priority'] == 'L') { // Sets priority for selected task
        priorityDetails = 'Low';
    } else if (fitleredTask['priority'] == 'H') {
        priorityDetails = 'Urgent';
    }
}

function setCurrentStatus(fitleredTask) {
    if (fitleredTask['status'] == '1') {
        currentStatus = 'To do';
    } else if (fitleredTask['status'] == '2') { // Sets current status for selected task
        currentStatus = 'in Progress';
    } else if (fitleredTask['status'] == '3') {
        currentStatus = 'Awaiting feedback';
    }
}

function toAddTaskPage() {
    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 880) {
        location.href = "../add_task/add_task.html"
    }
}


function searchTask() {
    let search = document.getElementById('search').value;
    searchInToDos(search);
    searchInProgress(search);
    searchInAwaitingFeedback(search);
    searchInDone(search);
}

// search functions, searches in all 4 categories (toDo, in progress, awaiting feedback, done)
function searchInToDos(search) {
    let openTasks = tasks.filter((task) => {
        return task['status'] == '1'
    });
    document.getElementById('open').innerHTML = '';
    for (let index = 0; index < openTasks.length; index++) {
        const element = openTasks[index];
        if (element['title'].includes(search)) {
            let openIndex = index + "o"
            document.getElementById('open').innerHTML += generateTodoHTML(element, openIndex);
            updateToDo(element, openIndex);
        }
    }
}

function searchInProgress(search) {
    let progress = tasks.filter((task) => {
        return task['status'] == '2'
    });
    document.getElementById('progress').innerHTML = '';
    for (let index = 0; index < progress.length; index++) {
        const element = progress[index];
        if (element['title'].includes(search)) {
            let progressIndex = index + "p"
            document.getElementById('progress').innerHTML += generateTodoHTML(element, progressIndex);
            updateToDo(element, progressIndex);
        }
    }
}

function searchInAwaitingFeedback(search) {
    let awaitingFeedback = tasks.filter((task) => {
        return task['status'] == '3'
    });
    document.getElementById('feedback').innerHTML = '';
    for (let index = 0; index < awaitingFeedback.length; index++) {
        const element = awaitingFeedback[index];
        if (element['title'].includes(search)) {
            let feedbackIndex = index + "f"
            document.getElementById('feedback').innerHTML += generateTodoHTML(element, feedbackIndex);
            updateToDo(element, feedbackIndex);
        }
    }
}

function searchInDone(search) {
    let done = tasks.filter((task) => {
        return task['status'] == '4'
    });
    document.getElementById('closed').innerHTML = '';
    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        if (element['title'].includes(search)) {
            let doneIndex = index + "d"
            document.getElementById('closed').innerHTML += generateTodoHTML(element, doneIndex);
            updateToDo(element, doneIndex);
        }
    }
}

// changes urgency/priority when clicking on an urgency button in change task details html
function changeUrgency(prio, id) {
    unsetChangedPrioHTML(id);
    changedUrgency = prio;
    if (prio === 'H') {
        document.getElementById('changeUrgentButton').classList.toggle('box_button_task_u');
        document.getElementById('changePrioUrgent').classList.toggle('urgency_img_u_clicked_task');
        document.getElementById('changePrioUrgent').classList.toggle('urgency_img_u_task');
    } else if (prio === 'L') {
        document.getElementById('changeLowButton').classList.toggle('box_button_task_l');
        document.getElementById('changePrioLow').classList.toggle('urgency_img_l_clicked_task');
        document.getElementById('changePrioLow').classList.toggle('urgency_img_l_task');
    } else if (prio === 'M') {
        document.getElementById('changeMediumButton').classList.toggle('box_button_task_m');
        document.getElementById('changePrioMedium').classList.toggle('urgency_img_m_clicked_task');
        document.getElementById('changePrioMedium').classList.toggle('urgency_img_m_task');
    }
}

// opens section where users/contacts can be selected
function toggleDropdownUser_Details(id) {
    const dropdown = document.getElementById(`dropdown${id}`);
    if (dropdown.classList.contains('display_none')) {
        dropdown.classList.toggle('display_none');
    } else if (!dropdown.classList.contains('display_none')) {
        dropdown.classList.toggle('display_none')
    }
    loadUser();
}

// Close Board Details
function closeBoardDetails() {
    document.getElementById('boardDetails').classList.add('d_none');
    selectedElement.splice(0);
}

function toggleTask() {
    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width > 880) {
        document.getElementById('overlayTask').classList.toggle("d_none");
    }
}

function toggleTask(id) {
    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width > 880) {
        document.getElementById('overlayTask').classList.toggle("d_none");
        if (!overlayTask.classList.contains('d_none')) {
            document.getElementById('overlayTask').innerHTML = taskOverlayHTML(id);
        }
    } else {
        location.href = "../add_task/add_task.html"
    }
}

function generateTodoHTML(element, index) {
    return `
    <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
        <div onclick="openBoardDetails(${element['id']}, '${index}')" class="todo_content">
            <div class="bg_category" id="checkCategory${index}">${element['categories'][0]['title']}</div>
            <div class="bg_title" id="checkTitle"><b>${element['title']}</b></div>
            <div class="bg_description" id="checkDescription">${element['description']}</div>
            <div id="boxSubTask${index}" class="box_subcategories">
            
            </div>
            <div class="todo_user_priority">
                <div class="box_todo_contact_img" id="checkUsers${index}"></div>
                <img id="prio${index}" class="priority_icon" src="">
            </div>
        </div>
    </div>
    `
}

function unsetChangedPrioHTML(id) {
    document.getElementById(`containerButtonsTask${id}`).innerHTML = `
    <button type='button' id="changeUrgentButton" onclick="changeUrgency('urgent', ${id}) " class="box_button_task ">
                <p class="text_urgency_task ">Urgent</p>
                <div id="changePrioUrgent" class="urgency_img_u_task urgency_img_task "></div>
    </button>
    <button type='button' id="changeMediumButton" onclick="changeUrgency('medium', ${id}) " class="box_button_task ">
                <p class="text_urgency_task ">Medium</p>
                <div id="changePrioMedium" class="urgency_img_m_task urgency_img_task "></div>
    </button>
    <button type='button' id="changeLowButton" onclick="changeUrgency('low', ${id}) " class="box_button_task ">
                <p class="text_urgency_task ">Low</p>
                <div id="changePrioLow" class="urgency_img_l_task urgency_img_task "></div>
    </button>
    `
}

function openBoardDetailsHTML(fitleredTask) {
    return `
    <div onclick="closeBoardDetails()" class="closeDetails"> x </div>
    <div class="taskDetailsHeader">  
        <div style="background-color: ${fitleredTask['categories'][0]['color']}" class="taskDetailsCategory"> ${fitleredTask['categories'][0]['title']} </div> 
    </div>  
        <div class="taskDetailsTitle"> ${fitleredTask['title']} </div>
        <div class="taskDetailsDescription"> ${fitleredTask['description']} </div> 
    <div class="timeAndPriority">
        <div class="dueDate"> <b> Due date: </b> <p> ${fitleredTask['due_date']} </p> </div>
        <div class="priority"> <b> Priority: </b> <div class="taskDetailsPriority" style="background-color: ${priorityColor};"> ${priorityDetails} </div>  </div>
    </div>
    <div class="taskDetailsSubtasks">
      <p><b> Subtasks: </b></p>
      <div id="place_subtasks">  </div> 
    </div>
    <div class="assignments">
    <p><b> Assigned To: </b></p>
        <div id="${fitleredTask.id}" class="assignedTo">
            
        </div>
    </div>
    <div onclick="changeTaskDetails(${fitleredTask.id})" class="pencilIcon">  <img src="../assets/img/pencil.png">  </div> 
    <img onclick="getDeleteTask(${fitleredTask.id}); closeBoardDetails()" class="trashImg" src="../assets/img/trash.png">
    `

}

function generateSubtasks(doneTasks, TaskTotal, index) {
    return `
    <div class="box_subtask_bar">
        <div id="subtaskBar${index}" class="subtask_bar"></div>
    </div>
    <div class="box_subtask_num">
        <p class="subtask_num"><span id="subtaskDone${index}">${doneTasks}</span>/${TaskTotal}</p>
        <p class="subtask_text">Done</p>
    </div>
    `
}

function taskOverlayHTML(id) {
    return `
<div class="background_overlay">
<div class="overlay_add_task">
<div class="place_add_task">
    <button onclick="toggleTask()" class="close_overlay_task">
        <img class="img_close_overlay_task" src="../assets/img/cross.png" alt="">
    </button>
    <div class="container_heading_task">
        <h1 class="heading_task">Add Task</h1>
    </div>
    <div>
        <form>
            <div class="main">
                <div class="place_input_left_task">
                    <div class="container_input_task">
                        <label>Title</label>
                        <input id="inputTitle" required class="input_task" minlength="3" maxlength="30" type="text" placeholder="Enter a title">
                    </div>
                    <div class="container_input_task">
                        <label>Description</label>
                        <textarea id="inputDescription" class="input_task_description" type="text" placeholder="Enter a Description"></textarea>
                    </div>
                    <div class="select_group">
                        <label class="label_select" for="button">Category</label>
                        <div id="placeSelectCategory" class="place_select_category">
                            <button type='button' onclick="toggleDropdown()" id="selectButtonTask" class="select_button_task">
                            <span class="select_label" id="selectedLabel">Select task category</span>
                            <div id="selectedColor" class="button_color selected_category_color"></div>
                            <div id="arrow" class="arrow"></div>
                        </button>
                        </div>
                        <div class="dropdown display_none" id="dropdown">
                            <div id="newCategory" onclick="selectTitle(this.id)" class="box_categoryelement">
                                <input type="radio" name="where" value="internet" class="option">
                                <label id="newCategory" class="select-item">New category</label>
                            </div>
                            <div id="addCategory">

                            </div>
                        </div>
                    </div>
                    <div class="select_group_2">
                        <label class="label_select " for="button">Assigned to</label>
                        <div id="placeSelectCategory2 " class="place_select_category">
                            <button type='button' onclick="toggleDropdownUser()" id="selectButtonTask2" class="select_button_task ">
                            <span class="select_label" id="selectedUser">Select user</span>
                            <div id="arrow " class="arrow "></div>
                        </button>
                        </div>
                        <div class="dropdown display_none" id="dropdown2">
                            <div id="addUser">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="seperation_task "></div>
                <div class="place_input_right_task ">
                    <div class="container_input_task ">
                        <label>Due date</label>
                        <div class="box_input_date ">
                            <input id="inputDate" type="date" class="input_task" required>
                        </div>
                    </div>
                    <div class="container_input_task ">
                        <label>Prio</label>
                        <div id="containerButtonsTask" class="container_buttons_task ">
                            <button type='button' id="urgentButton" onclick="selectUrgency( 'urgent') " class="box_button_task ">
                        <p class="text_urgency_task ">Urgent</p>
                        <div id="prioUrgent" class="urgency_img_u_task urgency_img_task "></div>
                    </button>
                            <button type='button' id="mediumButton" onclick="selectUrgency( 'medium') " class="box_button_task ">
                        <p class="text_urgency_task ">Medium</p>
                    <div id="prioMedium" class="urgency_img_m_task urgency_img_task "></div>
                    </button>
                            <button type='button' id="lowButton" onclick="selectUrgency( 'low') " class="box_button_task ">
                        <p class="text_urgency_task ">Low</p>
                    <div id="prioLow" class="urgency_img_l_task urgency_img_task "></div>
                    </button>
                        </div>
                    </div>
                    <div class="container_input_task">
                        <label>Subtasks</label>
                        <div class="container_subtask" id="containerSubtask">
                            <button type='button' onclick="openSubtask()" id="boxSubtaskInput" class="box_subtask_input">
                            <input required minlength="3" disabled="disabled" placeholder="Add new subtask" id="inputSubtask" type="text" class="input_subtask_fake">
                            <div  class="button_subtask_input">
                            <img class="img_subtask_task" src="../assets/img/plus_task.png" alt="#">
                            </div>
                        </button>
                        </div>
                        <div id="boxSubtasks" class="place_subtasks">

                        </div>
                    </div>
                    <div class="container_buttons_bottom_task ">
                        <button onclick="clearInputAddTask()" type='button' class="clear_button_task ">
                        <p class="text_clear_task ">Clear</p>
                        <div class="img_clear_task "></div>
                        </button>
                        <button onclick="checkValdation(${id});" type="button" value="submit" class="create_button_task ">
                        <p class=" ">Create Task</p>
                        <img src="../assets/img/check_white_task.png " alt="# ">
                    </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</div>
</div>
`
}

function changeTaskDetailsHTML(id) {
    return `
    <div onclick="closeBoardDetails()" class="closeDetails"> x </div>
    <div class="editCategories">
        <label class="detailsSubheadline">Title</label>
        <input id="inputTitle${id}" required class="input_task" minlength="3" maxlength="30" type="text" placeholder="Enter a title">
    </div>
    <div class="editCategories">
        <label class="detailsSubheadline">Description</label>
        <textarea id="inputDescription${id}" class="input_task_description" type="text" placeholder="Enter a Description"></textarea>
    </div>
    <div class="editCategories">
        <label class="detailsSubheadline">Due date</label>
        <div class="box_input_date">
        <input id="inputDate${id}" type="date" class="input_task" required>
        </div>
    </div>
    <div class="editCategories">
        <label class="detailsSubheadline">Prio</label>
        <div id="containerButtonsTask${id}" class="container_buttons_task ">
            <button type='button' id="changeUrgentButton" onclick="changeUrgency('H', ${id}) " class="box_button_task ">
                <p class="text_urgency_task ">Urgent</p>
                <div id="changePrioUrgent" class="urgency_img_u_task urgency_img_task "></div>
            </button>
            <button type='button' id="changeMediumButton" onclick="changeUrgency('M', ${id}) " class="box_button_task ">
                <p class="text_urgency_task ">Medium</p>
                <div id="changePrioMedium" class="urgency_img_m_task urgency_img_task "></div>
            </button>
            <button type='button' id="changeLowButton" onclick="changeUrgency('L', ${id}) " class="box_button_task ">
                <p class="text_urgency_task ">Low</p>
                <div id="changePrioLow" class="urgency_img_l_task urgency_img_task "></div>
            </button>
        </div>
    </div>
    <div class="editCategories">
        <label class="detailsSubheadline" for="button">Assigned to</label>
        <div id="placeSelectCategory2 " class="place_select_category">
            <button type='button' onclick="toggleDropdownUser_Details(${id})" id="selectButtonTask2" class="select_button_task ">
                <span class="select_label" id="selectedUser">Select user</span>
                <div id="arrow " class="arrow "></div>
            </button>
        </div>
        <div class="dropdown display_none" id="dropdown${id}">
            <div id="addUser">
            </div>
        </div>
    </div>

    <img onclick="confirmChangedTask(${id})" class="saveChangesImg" src="../assets/img/done_white.png">
   
    `
}

function generateSubtaskDetails(fitleredTask, i, index) {
    return `
    <div class="setSubtask"> 
        <input id="subtask${i}" style="width: 1rem" type="checkbox" onclick="setSubtaskDone(${fitleredTask.id},${i},'${index}')">
        <p>${fitleredTask.subtasks[i].title}</p>
     </div>`
}