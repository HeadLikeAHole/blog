if (document.getElementsByClassName('open-modal')[0]) {
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
}

// when the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// slide up message after 5 seconds
$(document).ready(function () {
    setTimeout(function () {
        // takes 2s to slide up
        $('.message').slideUp(2000)
    }, 5000)
});

// // get scroll top button
// const btnTop = document.getElementById('btn-top');
//
// // show scroll top button on scrolling down a bit
// window.onscroll = function () {
//     if (document.documentElement.scrollTop > 1500) {
//         btnTop.style.display = 'block';
//     } else {
//         btnTop.style.display = 'none';
//     }
// };
//
// // scroll top button
// btnTop.addEventListener('click', function () {
//     document.documentElement.scrollTop = 0;
// });
//
