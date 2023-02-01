function newPassword() {
    content = document.getElementById('contentContainer');
    content.innerHTML = '';
    document.getElementById('logInHeader').classList.add('d-none')
    content.innerHTML += forgotPasswordContainer();
}

function forgotPasswordContainer() {
    return `
    <div class="divForgotPassword">
    <img style="cursor: pointer;" onclick="backToLogin()" src="./assets/img/arrow.png">
    <form class="logInForm">
    <h1 style="margin-top: 0" class="logInHeadline">I forgot my password</h1>
    <hr class="underlineHeadline">
    <span> Don´t worry! We will send you an email with the instructions to reset your password. </span>
    <input required style="margin-top: 28px" class="logInInputMail" type="email" placeholder="Email">
    <button type="button" onclick="sentResetPassword()" style="width: 140px" class="logInBtn">Send me the mail</button>
    </form>
    </div>
    `
}

function sentResetPassword() {
    content = document.getElementById('contentContainer');
    content.innerHTML = '';
    document.getElementById('logInHeader').classList.remove('d-none')
    content.innerHTML += loginContainer();
    setTimeout(() => {
        document.getElementById('emailSent').classList.remove('d-none');
    }, 10)
    setTimeout(() => {
        document.getElementById('emailSent').classList.add('d-none');
    }, 5000)

}

function backToLogin() {
    content = document.getElementById('contentContainer');
    content.innerHTML = '';
    document.getElementById('logInHeader').classList.remove('d-none')
    content.innerHTML += loginContainer();
}

function loginContainer() {
    return `
        <div class="divLogIn">
            <form id="logInForm" class="logInForm" onsubmit="return false">
                <h1 class="logInHeadline">Log In</h1>
                <hr class="underlineHeadline">
                <input required id="logInInputMail" class="logInInputMail" type="email" placeholder="Email">
                <input required id="logInInputPassword" class="logInInputPassword" type="password" placeholder="Password">
                <div class="belowPassword">
                    <input type="checkbox">
                    <span>Remember me</span>
                    <a onclick="newPassword()">Forgot my password</a>
                </div>
                <div class="logInButtons">
                    <button onclick="onsubmitLogIn()" class="logInBtn">Log in</button>
                    <button onclick="onsubmitGuestLogIn()" class="guestLogInBtn">Guest Log in</button>
                </div>
            </form>
        </div>
        <div id="errorLogin" class="userAlert d-none"> User not found - <br> instead use Guest Log in </div>
        <div id="userCreated" class="userCreated d-none">User was successfully created!</div>
    `
}

function signUp() {
    content = document.getElementById('contentContainer');
    content.innerHTML = '';
    document.getElementById('logInHeader').classList.add('d-none')
    content.innerHTML += signUpContainer();
}

function signUpContainer() {
    return `
        <div style="height: 420px; padding: 14px" class="divLogIn">
        <img style="cursor: pointer;" onclick="backToLogin()" src="./assets/img/arrow.png">
            <form class="logInForm" onsubmit="registerUser(); return false">
                <h1 style="margin-top: 0" class="logInHeadline">Sign Up</h1>
                <hr class="underlineHeadline">
                <input required id="signUpInputName" class="logInInputName" type="text" placeholder="Name">
                <input required id="signUpInputMail" class="logInInputMail" type="email" placeholder="Email">
                <input required id="signUpInputPassword" class="logInInputPassword" type="password" placeholder="Password">
                <div style="margin-top: 10px" class="logInButtons">
                    <button class="logInBtn">Sign Up</button>
                </div>
            </form>
        </div>
    `
}

function registerUser() {
    let mail = document.getElementById('signUpInputMail').value;
    let password = document.getElementById('signUpInputPassword').value;
    let name = document.getElementById('signUpInputName').value;
    let userDetails = { 'mail': `${mail}`, 'name': `${name}`, 'password': `${password}` }
    users.push(userDetails)
    saveUserInLocalStorage()
    submitSignUp()
}

function saveUserInLocalStorage() {
    usersAsString = JSON.stringify(users);
    window.localStorage.setItem('user', usersAsString);
}

function onsubmitLogIn() {
    document.getElementById('logInForm').setAttribute("onsubmit", "LogIn(); return false")
}

function LogIn() {
    let mail = document.getElementById('logInInputMail').value;
    let password = document.getElementById('logInInputPassword').value
    users = [];
    if (window.localStorage.getItem('user') === null) {
        document.getElementById('logInInputMail').value = '';
        document.getElementById('logInInputPassword').value = '';
        document.getElementById('errorLogin').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('errorLogin').classList.add('d-none');
        }, 5000)
    } else {
        users.push(window.localStorage.getItem('user'))
        usersAsObject = JSON.parse(users)
        for (let i = 0; i < usersAsObject.length; i++) {
            const element = usersAsObject[i];
            if (element['mail'] == `${mail}` && element['password'] == `${password}`) {
                window.location.href = "../summary/summary.html"
                currentUserName = element['name'];
            } else {
                document.getElementById('logInInputMail').value = '';
                document.getElementById('logInInputPassword').value = '';
                document.getElementById('errorLogin').classList.remove('d-none');
                setTimeout(() => {
                    document.getElementById('errorLogin').classList.add('d-none');
                }, 5000)
            }
        }
    }
}

function submitSignUp() {
    backToLogin()
    setTimeout(() => {
        document.getElementById('userCreated').classList.remove('d-none');
    }, 100)
    setTimeout(() => {
        document.getElementById('userCreated').classList.add('d-none');
    }, 5000)
}

function guestLogIn() {
    window.location.href = "./summary/summary.html";
}

function onsubmitGuestLogIn() {
    document.getElementById(`logInInputMail`).required = false;
    document.getElementById(`logInInputPassword`).required = false;
    let userDetails = { 'name': 'Guest' }
    users.push(userDetails)
    saveUserInLocalStorage();
    document.getElementById('logInForm').setAttribute("onsubmit", "guestLogIn(); return false")
}