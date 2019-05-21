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

// nav bar slide
const burger = document.querySelector('.burger');
const nav = document.querySelector('.right-bar');
const navLinks = document.querySelectorAll('.right-bar li');

burger.addEventListener('click', function () {
    // toggle navbar back to the screen and off the screen
    nav.classList.toggle('nav-active');
    // slide navbar slowly
    nav.style.transition = 'transform 0.5s ease-in';
    // move links one by one
    navLinks.forEach(function (link, index) {
        if (link.style.animation) {
            // restart animation
            link.style.animation = '';
        } else {
            // ${index / 7 + 0.3}s sets delay for each link
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    // toggle between burger and X
    burger.classList.toggle('toggle');
});

