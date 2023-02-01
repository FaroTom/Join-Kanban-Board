function changeHTML(id) {
    if (id == "s") {
        location.href = "../summary/summary.html"
    } else if (id === "b") {
        location.href = "../board/board.html"
    } else if (id === "t") {
        location.href = "../add_task/add_task.html"
    } else if (id === "c") {
        location.href = "../contacts/contacts.html"
    }
    
}

function changeColor(id) {
    const elements = document.querySelectorAll('.box_links_aside');
    elements.forEach(element => {
        element.style.backgroundColor = "#2A3647"
    });
    document.getElementById(id).parentElement.style.backgroundColor = "#091931"
}

function changeColors(id) {
    const elements = document.querySelectorAll('.box_links_aside');
    elements.forEach(element => {
        element.style.backgroundColor = "#2A3647"
    });
    document.getElementById(id).parentElement.style.backgroundColor = "#091931"
}

// click on profile opens log-out popup, if popup is shown and profile gets clicked again, popup gets closed
function openLogOut() {
    if(document.getElementById('logOutButton').classList.contains('d-none')) {
        document.getElementById('logOutButton').classList.remove('d-none');
    } else {
        document.getElementById('logOutButton').classList.add('d-none');
    }
}

function logOut() {
    location.href = "../index.html"
    localStorage.clear();
}

function openInfos() {
    location.href="../join-info/join-info.html"
}