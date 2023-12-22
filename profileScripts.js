homeUI()
function getCurrentUserId() {
    const url = new URLSearchParams(window.location.search)
    userId = url.get("POST")

    return userId

}

function getUser() {

    const userId = getCurrentUserId()

    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}`)
        .then((response) => {

            console.log(response)

            let user = response.data.data
            document.getElementById("profile-image").src = user.profile_image
            document.getElementById("main-info-name").innerHTML = "Name: " + user.name
            document.getElementById("main-info-email").innerHTML = "Email: " + user.email
            document.getElementById("main-info-username").innerHTML = "User-name: " + user.username
            document.getElementById("user-name").innerHTML = user.username + " Post's"

            document.getElementById("no-comment").innerHTML = user.comments_count
            document.getElementById("no-posts").innerHTML = user.posts_count
        })
}


function getPosts() {
    const userId = getCurrentUserId()

    axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`)
        .then((response) => {
            let posts = response.data.data
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
             <div class="card shadow p-3 my-5 " style="cursor: pointer; id = "posts"">
                    <div class="card-header" >
                        <img src="${post.image}" alt="" class="rounded-circle border border-3" style="width: 50px; height: 50px;">
                        <h1 class="d-inline fs-4">@${post.author.username}</h1>
                        ${editButtonContent}
                    </div>
            
                    <div class="card-body" onClick="postClicked(${post.id})">
                        <img src="${post.image}" alt="" class="w-100">
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
                                <span id="post-tag-${post.id}">
                                    <button type="button" class="btn btn-outline-secondary">${post.tags}</button>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
           
            

                    `

                document.getElementById("posts").innerHTML += content
                const currentPostIdTags = `post-tag-${post.id}`
                document.getElementById(currentPostIdTags).innerHTML = ""

                for (tag of post.tags) {
                    console.log(tag)

                    let content =
                        ` 
                     <button type="button" class="btn btn-outline-secondary rounded-5" style="margin: 5px;">${tag.name}</button>
                    `
                    document.getElementById(currentPostIdTags).innerHTML += content
                }



            }

        })
    homeUI()
}

