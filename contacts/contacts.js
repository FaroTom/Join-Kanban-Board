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

async function renderContacts() {
    /*  await getTodos(); */
    filterLetters();
    showContacts();
}


// Placeholder!! Needs to be filled with input from 'Add Contact'-field. 


let colors = ['orange', 'purple', 'blue', 'red', 'aqua', 'brown', 'grey', 'green'];
let letters = [];

function filterLetters() {
    contacts.forEach(contact => {
        if (!letters.includes(contact.firstName.charAt(0))) {
            letters.push(contact.firstName.charAt(0))
        }
    });
    showLetters();
}

function showLetters() {
    document.getElementById('contactList').innerHTML = "";
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        document.getElementById('contactList').innerHTML += generateLetters(letter);
    }
}

function showContacts() {
    const cards = document.querySelectorAll('containerCard')
    for (let j = 0; j < cards.length; j++) {
        const card = cards[j];
        card.innerHTML = "";
    }
    for (let i = 0; i < contacts.length; i++) {
        const singleContact = contacts[i];

        let singleContactLetter = singleContact.firstName.charAt(0);
        let id = "boxContact" + singleContactLetter;


        document.getElementById(id).innerHTML += showContactsHTML(singleContact, i);
        document.getElementById('circle' + i).style.backgroundColor = singleContact.color;
    }
}

function checkValdationContact(event, i) {
    event.preventDefault();
    let fullName = document.getElementById('name').value;
    if (checkNamelength(fullName)) {
        let [first, last] = fullName.split(' ');
        createContact(last, first, i)
    } else {
        alert('invalid Name')
    }
}


function createContact(lastName, firstName, i) {
    let id;
    let editId;
    let createId;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let color = document.getElementById('showContactImg').style.backgroundColor;
    if (i) {
        editId = contacts[i].id;
        let index = contacts.indexOf(contacts[i])
        contacts.splice(index, 1)
    } else {
        createId = contacts.length + 1;
    }
    editId ? id = editId : id = createId

    let contact = {
        'id': id,
        'lastName': lastName,
        'firstName': firstName,
        'email': email,
        'phone': phone,
        'color': color
    }
    contacts.push(contact)
    i ? toggleOverlayEditContact() : toggleOverlayNewContact();
    renderContacts();
}



function createColor() {
    let randomColor = colors[Math.floor(Math.random() * colors.length)]
    document.getElementById('showContactImg').style.backgroundColor = randomColor;
}

function toggleOverlayNewContact() {
    document.getElementById('overlay').classList.toggle("d_none");
    if (!overlay.classList.contains('d_none')) {
        overlay.innerHTML = newContactOverlayHTML();
        createColor();
    }
}

function toggleOverlayEditContact(i) {
    document.getElementById('overlayEdit').classList.toggle("d_none");
    if (!overlayEdit.classList.contains('d_none')) {
        overlayEdit.innerHTML = editContactOverlayHTML(i);
        showEditContact(i)
    }
}

function toggleTask() {
    document.getElementById('overlayTask').classList.toggle("d_none");
    if (!overlayTask.classList.contains('d_none')) {
        overlayTask.innerHTML = taskOverlayHTML();
    }
}

function showEditContact(i) {
    document.getElementById('name').value = contacts[i].firstName + ' ' + contacts[i].lastName;
    document.getElementById('email').value = contacts[i].email;
    document.getElementById('phone').value = contacts[i].phone;
    document.getElementById('showContactImg').style.backgroundColor = contacts[i].color;
    showName();

}

function showName() {
    let circle = document.getElementById('showContactImg');
    let fullName = document.getElementById('name').value;
    let [first, last] = fullName.split(' ');
    circle.innerHTML = "";
    circle.innerHTML += first.charAt(0)
    circle.innerHTML += last.charAt(0)
}

function checkNamelength(name) {
    name = name.split(" ");

    if (name.length === 2) {
        return true
    }
}


function closeContactForm() {
    document.getElementById('contactForm').classList.add('none');
}

function showSelectedContact(i) {
    resetContactClicked();

    document.getElementById('showContactBox').innerHTML = '';
    document.getElementById('showContactBox').innerHTML = showSelectedContactHTML(contacts[i], i);

    document.getElementById('showContactCircle').style.backgroundColor = contacts[i].color;
    document.getElementById("buttonContact" + i).style.backgroundColor = "#2A3647"
    document.getElementById("contactName" + i).style.color = "white"
}

function resetContactClicked() {
    const contactCardButtons = document.querySelectorAll('.contact_card_button');
    const contactNames = document.querySelectorAll('.contact_name');

    for (let j = 0; j < contactCardButtons.length; j++) {
        contactCardButtons[j].style.backgroundColor = 'white';
        contactNames[j].style.color = 'black';
    }
}

function showContactDetails() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 1000) {
        if (document.getElementById('container_contacts_right').classList.contains('d-none')) {
            document.getElementById('container_contacts_right').classList.remove('d-none');
        }
        document.getElementById('container_contacts_right').style.zIndex = "1000";
        document.getElementById('container_contacts_left').classList.add('d-none');
        document.getElementById('container_contacts_right').innerHTML += '<img onclick="closeContactDetails()" class="arrowLeft" src="../assets/img/arrow-left.png">'
    }
}

function closeContactDetails() {
    document.getElementById('container_contacts_right').classList.add('d-none');
    document.getElementById('container_contacts_left').classList.remove('d-none');
}

function generateLetters(letter) {
    return `   
    <div id="boxContact${letter}" class="box_contact">
        <div class="contact_letter">
            <h3>${letter}</h3>
        </div>
    </div>`
}

function showContactDetails() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 1000) {
        if (document.getElementById('container_contacts_right').classList.contains('d-none')) {
            document.getElementById('container_contacts_right').classList.remove('d-none');
        }
        document.getElementById('container_contacts_right').style.zIndex = "1000";
        document.getElementById('container_contacts_left').classList.add('d-none');
        document.getElementById('container_contacts_right').innerHTML += '<img onclick="closeContactDetails()" class="arrowLeft" src="../assets/img/arrow-left.png">'
    }
}

function closeContactDetails() {
    document.getElementById('container_contacts_right').classList.add('d-none');
    document.getElementById('container_contacts_left').classList.remove('d-none');
}

function generateLetters(letter) {
    return `   
    <div id="boxContact${letter}" class="box_contact">
        <div class="contact_letter">
            <h3>${letter}</h3>
        </div>
    </div>`
}

function showContactsHTML(singleContact, i) {
    return `
    <div id="containerCard" class="container_cards">
        <button id="buttonContact${i}" class="contact_card_button" onclick="showSelectedContact(${i}); showContactDetails()">
            <div class="contact_list_container">
                <div id="circle${i}" class="contact_list_img">
                    <p>${singleContact['firstName'].charAt(0)}${singleContact['lastName'].charAt(0)}</p>
                </div>
                <div class="contact_content">
                    <div id="contact" class="contact_list_name">
                        <p class="contact_name" id="contactName${i}">${singleContact['firstName']} ${singleContact['lastName']}</p>
                    </div>
                    <div class="contact_list_email">
                        <p>${singleContact['email']}</p>
                    </div>
                </div>
            </div>
        </button>
    </div>
    `
}

function showSelectedContactHTML(selectedContact, i) {
    return `
        <div class="contact_list_content">
            <div id="showContactCircle" class="show_contact_img">${selectedContact['firstName'].charAt(0)}${selectedContact['lastName'].charAt(0)}</div>
            <div class="show_contact_box_name_add_task">
                <p class="show_contact_name">${selectedContact['firstName']} ${selectedContact['lastName']}</p>
                <button onclick="toggleTask()" class="button_plus_add_task">
                    <p class="show_contact_plus">+</p>
                    <p class="show_contact_add_task">Add Task</p>
                </button>
            </div>
        </div>
        <div class="headingAndChangeContact">
            <h4 class="contact_information">Contact Information</h4>
            <button onclick="toggleOverlayEditContact(${i})">
                <img src="../assets/img/pencil_blue.png">
            </button>
        </div>
        <div class="box_contact_content">
            <p class="contact_content_p">Email</p>
            <p class="contact_content_email">${selectedContact['email']}</p>
        </div>
        <div class="box_contact_content">
            <p class="contact_content_p">Phone</p>
            <p class="contact_content_email">${selectedContact['phone']}</p>   
        </div>
    `
}

/* function editContactHTML(i) {
    return `
    <div class="overlay_edit_contact">
        <div class="edit_overlay_leftside">
            <div class="edit_contact_logo"> <img src="../assets/img/logo_sidebar.png"> </div>
            <div class="edit_contact_title"> 
                Edit Contact 
                <div class="edit_contact_seperation"> </div>
            </div>
        </div>
        <div class="edit_overlay_rightside">
            <form class="rightside_form" onsubmit="editContact(${i}); return false">
            <input onblur="showName();checkNamelength(this.id)"  required  type='text'  placeholder="Name" class="overlay_input name" id="edit_firstName">
            <input onblur="showName();checkNamelength(this.id)"  required  type='text'  placeholder="Name" class="overlay_input name" id="edit_lastName">
            <input required placeholder="Email" class="overlay_input email" type="email" id="edit_email">
            <input required placeholder="Phone" minlength="11" class="overlay_input phone" type="number" id="edit_phone">
            <div class="place_buttons_overlay">
            <button type="button" class="box_cancel">
                <p>Cancel</p>
                <p>x</p>
            </button>
            <button type="submit" class="overlay_create_button">
                <p>Edit contact</p>
                <img src="../assets/img/check_white_task.png " alt="">
            </button>
            </div>
            </form>
        </div>
        <div onclick="closeEditContact()" class="close_edit_contact"> <img src="../assets/img/cross.png"> </div>
    </div>
    `
}
 */
function taskOverlayHTML() {
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
                                <button onclick="checkValdation();" type="button" value="submit" class="create_button_task ">
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

function newContactOverlayHTML() {
    return `
    <div class="background_overlay">
    <div class="overlay_add_contact ">
    <div class="overlay_leftside">
        <img class="leftside_img" src="../assets/img/logo_sidebar.png" alt="">
        <p class="leftside_Add">Add contact</p>
        <p class="leftside_text">Tasks are better with a team !</p>
    </div>
    <div class="overlay_rightside">
        <button onclick="toggleOverlayNewContact()" class="close_overlay">
                <img class="img_close_overlay" src="../assets/img/cross.png" alt="">
            </button>
        <div class="rightside_place_circle">
            <div id="showContactImg" class="show_contact_img">

            </div>
        </div>
        <form class="rightside_form" onsubmit="checkValdationContact(event); return false">
            <input onblur="showName();checkNamelength(this.id)"  required  type='text'  placeholder="Name" class="overlay_input name" id="name">
            <input required placeholder="Email" class="overlay_input email" type="email" id="email">
            <input required placeholder="Phone" minlength="11" class="overlay_input phone" type="number" id="phone">
            <div class="place_buttons_overlay">
                <button onclick="toggleOverlayNewContact()" type="button" class="box_cancel">
                    <p>Cancel</p>
                    <p>x</p>
                </button>
                <button type="submit" class="overlay_create_button">
                    <p>Create contact</p>
                    <img src="../assets/img/check_white_task.png " alt="">
                </button>
            </div>
        </form>
    </div>
</div>
</div>
    `
}

function editContactOverlayHTML(i) {
    return `
    <div class="background_overlay">
        <div class="overlay_add_contact ">
            <div class="overlay_leftside">
                <img class="leftside_img" src="../assets/img/logo_sidebar.png" alt="">
                <p class="leftside_Add">Edit contact</p>
                <p class="leftside_text">Tasks are better with a team !</p>
            </div>
            <div class="overlay_rightside">
                <button onclick="toggleOverlayEditContact()" class="close_overlay">
                    <img class="img_close_overlay" src="../assets/img/cross.png" alt="">
                </button>
                <div class="rightside_place_circle">
                    <div id="showContactImg" class="show_contact_img">

                    </div>
                </div>
                <form class="rightside_form" onsubmit="checkValdationContact(event, ${i}); return false">
                    <input onblur="showName();checkNamelength(this.id)" required type='text' placeholder="Name" class="overlay_input name" id="name">
                    <input required placeholder="Email" class="overlay_input email" type="email" id="email">
                    <input required placeholder="Phone" minlength="11" class="overlay_input phone" type="number" id="phone">
                    <div class="place_buttons_overlay">
                        <button onclick="toggleOverlayEditContact()" type="button" class="box_cancel">
                        <p>Cancel</p>
                        <p>x</p>
                    </button>
                        <button type="submit" class="overlay_create_button">
                        <p>Edit contact</p>
                        <img src="../assets/img/check_white_task.png " alt="">
                    </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
}