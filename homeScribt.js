// handle scrolling //
let currentPage = 1
let lastPage = 1
window.addEventListener("scroll", () => {

    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    console.log(currentPage, lastPage)
    if (endOfPage && currentPage < lastPage) {

        currentPage = currentPage + 1

        getPosts(currentPage)


    }
});
// handle scrolling //

function postClicked(postId) {

    window.location = `postDetails.html?POST=${postId}`


}

function deletePostClicked(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))
    let postId = document.getElementById("post-id").value = post.id

    let postModal = new bootstrap.Modal(document.getElementById("deletePost-modal"))
    postModal.toggle()
}


function deletePost() {

    let postId = document.getElementById("post-id").value
    let token = localStorage.getItem("token")
    let headers = {
        "Authorization" : `Bearer ${token}`
    }

        axios.delete (`https://tarmeezacademy.com/api/v1/posts/${postId}`, {headers : headers})
            .then((response) => {

                console.log(response)
                let modal = document.getElementById("deletePost-modal")
                let modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showAlerts("Deleted Successfully!", "success")
                homeUI()
                getPosts()

            }).catch(error => {
                showAlerts(error.message, "danger")
            })


}


function createNewPostClicked() {


    document.getElementById("post-id-input").value = ""
    document.getElementById("modal-post-title").innerHTML = "Creat A New Post"
    document.getElementById("post-btn").innerHTML = "Creat"
    document.getElementById("Title").value = ""
    document.getElementById("postContent").value = ""


    let postModal = new bootstrap.Modal(document.getElementById("new-Post-modal"))
    postModal.toggle()
}

function EditPost(postObj) {
    let post = JSON.parse(decodeURIComponent(postObj))

    document.getElementById("Post-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("Modal-post-title").innerHTML = "Edit Post"
    document.getElementById("Title").value = post.title
    document.getElementById("postContent").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("new-Post-modal"))
    postModal.toggle()
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

            let modal = document.getElementById("new-Post-modal")
            let modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlerts("Posted successfully!!", "success")
            getPosts()
        }).catch(error => {

            showAlerts(error.message, "danger")
        })


}

