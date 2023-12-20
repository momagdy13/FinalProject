function homeUI() {
    let token = localStorage.getItem("token")
    let logindiv = document.getElementById("login-div")
    let logoutBtn = document.getElementById("logout-div")
    let addBtn = document.getElementById("creatPost-btn")
    let commentArea = document.getElementById("write-comment")


    if (token == null) {
        if (addBtn != null) {
            addBtn.style.setProperty("display", "none", "important")
        }
        logindiv.style.setProperty("display", "flex", "important")
        logoutBtn.style.setProperty("display", "none", "important")
        if (commentArea != null) {
            commentArea.style.setProperty("display", "none", "important")

        }


    } else {
        if (addBtn != null) {
            addBtn.style.setProperty("display", "block", "important")
        }
        logoutBtn.style.setProperty("display", "flex", "important")
        logindiv.style.setProperty("display", "none", "important")
        if (commentArea != null) {
            commentArea.style.setProperty("display", "flex", "important")

        }
        document.getElementById("userName").innerHTML = getCurrentUser().username
        document.getElementById("user-image").src = getCurrentUser().profile_image
    }

}
function showAlerts(messagealert, Type) {
    const alertPlaceholder = document.getElementById("alert")
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${Type} alert-dismissible" role="alert"  >`,
            `   <div>${messagealert}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',

            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    appendAlert(messagealert, 'success')

    //TODO setTimeout(() => {

    //     const alert = bootstrap.Alert.getOrCreateInstance('#success-alert')
    //     alert.close()
    // }, 3000)

}
function registerNewUser() {

    console.log("meaw")
    let userName = document.getElementById("register-username").value
    let name = document.getElementById("register-name").value
    let email = document.getElementById("register-email").value
    let password = document.getElementById("password").value
    let image = document.getElementById("register-image").files[0]

    let formData = new FormData()
    formData.append("username", userName)
    formData.append("name", name)
    formData.append("emali", email)
    formData.append("password", password)
    formData.append("image", image)

    let header = {
        "Content-Type": "multipart/form-data"
    }


    axios.post(`https://tarmeezacademy.com/api/v1/register`, formData, { headers: header })
        .then((response) => {

            let token = response.data.token
            localStorage.setItem("token", token)

            console.log(response)

            let modal = document.getElementById("Register-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlerts("Register In Successfully!", "success")

            homeUI()



        }).catch(erroe => {
            showAlerts(erroe.response.data.message, "danger")
        })

}

function Login() {
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    let params =
    {
        "username": username,
        "password": password
    }

    axios.post("https://tarmeezacademy.com/api/v1/login", params)
        .then((response) => {
            let token = response.data.token
            let uesername = response.data.user.username

            let image = response.data.user.profile_image

            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(response.data.user))

            console.log(response)
            let modal = document.getElementById("login-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlerts("Logged In Successfully!", "success")
            homeUI()

        }).catch(error => {
            alert(error)
        })


}
function logout() {
    localStorage.removeItem("token")
    showAlerts("Logged Out Successfully!", "success");
    homeUI()
}

function Home() {
    window.location = "home.html"
}

function getCurrentUser() {
    let user = ""
    const userStorage = localStorage.getItem("user")
    if (user != null) {
        user = JSON.parse(userStorage)
    }

    return user

}
function createNewPost() {
    let title = document.getElementById("Title").value
    let content = document.getElementById("postContent").value
    let image = document.getElementById("Image").files[0]

    let formData = new FormData()
    formData.append("body", content)
    formData.append("title", title)
    formData.append("image", image)

    let token = localStorage.getItem("token")
    let header = {
        "authorization": `Bearer ${token}`
    }
    axios.post("https://tarmeezacademy.com/api/v1/posts", formData, { headers: header })
        .then((response) => {
            console.log(response)

            let modal = document.getElementById("newPost-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlerts("Posted successfully!!", "success")
            getPost()
        }).catch(error => {

            alert(error)
        })

}