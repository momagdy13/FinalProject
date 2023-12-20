function getPost(page) {



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
                        `                <button onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')" type="button" class="btn btn-outline-secondary mx-2" style = "float: inline-end;" id="login-btn">Edit</button>
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

                document.getElementById(currentPostIdTags).innerHTML = ""

                for (tag of post.tags) {
                    console.log(tag)

                    let content =
                        `
                    
                       
                          <button type="button" class="btn btn-outline-secondary rounded-5" style="margin: 5px;">${tag.name} hh</button>

                    `
                    document.getElementById(currentPostIdTags).innerHTML += content

                }


            }

        })
    homeUI()
}


function createNewPost() {
    let postId = document.getElementById("post-id-input").value
    let isCreat = postId == null || postId == ""


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
    let url = ``
    if (isCreat) {
        url = "https://tarmeezacademy.com/api/v1/posts"



    } else {
        formData.append("_method", "put")
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`


    }
    axios.post(url, formData, { headers: header })
        .then((response) => {
            console.log(response)

            let modal = document.getElementById("newPost-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlerts("Posted successfully!!", "success")


            getPost()
            getPost()

        }).catch(error => {

            showAlerts(error.message, "danger")
        })


}
// handle scrolling //
let currentPage = 1
let lastPage = 1
window.addEventListener("scroll", () => {

    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    console.log(currentPage, lastPage)
    if (endOfPage && currentPage < lastPage) {

        currentPage = currentPage + 1

        getPost(currentPage)


    }
});
// handle scrolling //

function postClicked(postId) {

    window.location = `postDetails.html?POST=${postId}`

}

function editPost(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))

    document.getElementById("post-id-input").value = post.id
    document.getElementById("modal-post-title").innerHTML = "Edit Post"
    document.getElementById("post-btn").innerHTML = "Update"
    document.getElementById("Title").value = post.title
    document.getElementById("postContent").value = post.body


    let postModal = new bootstrap.Modal(document.getElementById("newPost-modal"))
    postModal.toggle()
}

function createNewPostBtn() {


    document.getElementById("post-id-input").value = ""
    document.getElementById("modal-post-title").innerHTML = "Creat A New Post"
    document.getElementById("post-btn").innerHTML = "Creat"
    document.getElementById("Title").value = ""
    document.getElementById("postContent").value = ""


    let postModal = new bootstrap.Modal(document.getElementById("newPost-modal"))
    postModal.toggle()
}