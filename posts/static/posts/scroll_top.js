// smooth scroll top button
$(document).ready(function () {
    $(window).scroll(function () {
        // if viewport is lower than 1000px from the top display the scroll top button
        if ($(this).scrollTop() > 1000) {
            $('#btn-top').fadeIn('slow')
        } else {
            $('#btn-top').fadeOut('slow')
        }
    });
    // return to the top when scroll top button is clicked
    $('#btn-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 500)
    });
});