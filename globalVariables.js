async function getCategories() {
    try {
        let responseServer = await fetch('https://jonas34.pythonanywhere.com/categories/', { method: 'GET', headers: { 'Content-Type': 'application/json', } });
        if (!responseServer.ok)
            throw new Error("Response not ok")
        categoryLabels = await responseServer.json();
    } catch (error) {
        console.error(error)
    }
}
async function getSubtasks() {
    try {
        let responseServer = await fetch('https://jonas34.pythonanywhere.com/subtasks/', { method: 'GET', headers: { 'Content-Type': 'application/json', } });
        if (!responseServer.ok)
            throw new Error("Response not ok")
        subtasks = await responseServer.json();
    } catch (error) {
        console.error(error)
    }
}


async function changeSubtask(subtask, url) {
    console.log(url)
    console.log(subtask)
    const data = JSON.stringify(subtask);
    fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
}

async function deleteSubtask(subtask, url) {
    console.log(url)
    console.log(subtask)
    const data = JSON.stringify(subtask);
    fetch(url, {
            method: 'DELETE',
            body: data
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
}



async function getTodos() {
    try {
        let responseServer = await fetch('https://jonas34.pythonanywhere.com/todos/', { method: 'GET', headers: { 'Content-Type': 'application/json', } });
        if (!responseServer.ok)
            throw new Error("Response not ok")
        tasks = await responseServer.json();
    } catch (error) {
        console.error(error)
    }
}

async function postTodo(task) {
    const data = JSON.stringify(task);
    fetch('https://jonas34.pythonanywhere.com/todos/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))

}


async function putToDo(task, url) {
    const data = JSON.stringify(task);
    fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
}

async function deleteToDo(task, url) {
    const data = JSON.stringify(task);
    fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
}


async function render(id) {
    await getTodos();
    await getSubtasks();
    await getCategories();
    if (id === 'summary') {
        renderSummary();
    } else if (id === "board") {
        renderBoard();
    } else if (id === "task") {
        renderTask();
    } else if (id === "contacts") {
        renderContacts()
    }

}


let contacts = [{
    'id': 0,
    'lastName': 'Hügel',
    'firstName': 'Adam',
    'email': 'HügelAdam@gmail.com',
    'phone': '123',
    'color': 'red'
}, {
    'id': 1,
    'lastName': 'Müller',
    'firstName': 'Berta',
    'email': 'BGI@gmail.com',
    'phone': '014525343243',
    'color': 'blue'
}, {
    'id': 2,
    'lastName': 'Kovin',
    'firstName': 'Charlie',
    'email': 'CGI@gmail.com',
    'phone': '017879643243',
    'color': 'aqua'
}, {
    'id': 3,
    'lastName': 'Baltwin',
    'firstName': 'Dora',
    'email': 'DoBawin@gmail.com',
    'phone': '017325378902',
    'color': 'brown'
}, {
    'id': 4,
    'lastName': 'Mayer',
    'firstName': 'Eva',
    'email': 'E.Mayer@gmail.com',
    'phone': '013368345639',
    'color': 'orange'
}];

let users = []
let lastId;
let tasks;
let categoryLabels;
let subtasks;