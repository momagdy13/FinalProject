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

function Profile(){
    window.location = "profile.html"

}
function getCurrentUser() {
    let user = ""
    const userStorage = localStorage.getItem("user")
    if (user != null) {
        user = JSON.parse(userStorage)
    }

    return user

}
function getPosts(page) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
        .then((response) => {
            let posts = response.data.data
            lastPage = response.data.meta.last_page
            console.log(posts)


            for (post of posts) {

                let postTitle = ""

                // show or hide edit button //
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editButtonContent = ``
                if (isMyPost) {
                    editButtonContent =
                        `      
                   
                <button onclick="deletePostClicked('${encodeURIComponent(JSON.stringify(post))}')" type="button" class="btn btn-outline-danger mx-2" style = "float: inline-end; margin-right = 10px ;" id="delete-btn">Delete</button>
                 <button onclick="EditPost('${encodeURIComponent(JSON.stringify(post))}')" type="button" class="btn btn-outline-secondary mx-2" style = "float: inline-end;" id="edit-btn">Edit</button>
                `
                }
                if (!post.title == null) {

                    postTitle = posttitle
                }
                let content =
                    `

    <div class="card shadow p-3 my-5 " style = "cursor: pointer;" >
                <div class="card-header">
                <img src="${post.image}" alt="" class="rounded-circle border border-3"
                style="width: 50px; height: 50px;">
                <h1 class="d-inline fs-4">@${post.author.username}</h1>

                ${editButtonContent}
                </div>

            <div class="card-body" onClick ="postClicked(${post.id})">
                <img src="${post.image}" alt="" class="w-100" >

                <p id="timeUpload">${post.created_at}</p>
                <h4 class="fs-4">
                ${post.title}
                </h4>
                <p>${post.body}</p>
                <hr>
           <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     class="bi bi-chat-text" viewBox="0 0 16 16">
                    <path
                        d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894m-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                     <path
                        d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8m0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5" />
                </svg>
        <span>
          (${post.comments_count}) comments
              <span id = "post-tag-${post.id}">
                     <button type="button" class="btn btn-outline-secondary">${post.tags}</button> 
              </span>
        </span>
    </div>
                
        `

                document.getElementById("posts").innerHTML += content
                const currentPostIdTags = `post-tag-${post.id}`
                for (tag of post.tags) {
                    console.log(tag)

                    let content =
                        ` <button type="button" class="btn btn-outline-secondary rounded-5" style="margin: 5px;">${tag.name} hh</button>
                    `
                    document.getElementById(currentPostIdTags).innerHTML += content
                }


            }

        })
    homeUI()
}
