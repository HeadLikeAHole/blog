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

// slide up message after 5 seconds
$(document).ready(function () {
    $(function () {
        setTimeout(function () {
            $('.alert').slideUp(2000)
        }, 5000)
    });
});
