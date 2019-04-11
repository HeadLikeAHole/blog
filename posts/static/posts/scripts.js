// get the modal
const modal = document.getElementById('modal');

// get the button that opens the modal
const openModal = document.getElementsByClassName('open-modal')[0];

// get the element that closes the modal
const closeModal = document.getElementsByClassName('close-modal')[0];

// when the user clicks the open button, open the modal
openModal.onclick =  function () {
    modal.style.display = 'block';
};

// when the user clicks the close button, open the modal
closeModal.onclick = function () {
    modal.style.display = 'none';
};

// when the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


// like button ajax request

// get the like button
const likeButton = document.getElementsByClassName('btn-like')[0];

const updateLikeButtonText = (button, newCount, verb) => {
    button.innerText = newCount + ' ' + verb
};

likeButton.addEventListener('click', function () {
    const likeUrl = likeButton.getAttribute('data-api-like-url');

    fetch(likeUrl).then(res => res.json()).then(data => {
        let newLikes;
        const likesCount = parseInt(data.likes_count);
        if (data.authenticated) {
            if (data.add_like) {
                newLikes = likesCount + 1;
                updateLikeButtonText(this, newLikes, 'Unlike')
            } else {
                newLikes = likesCount - 1;
                updateLikeButtonText(this, newLikes, 'Like')
            }
        }
    }).catch(err => console.log(err))
});
