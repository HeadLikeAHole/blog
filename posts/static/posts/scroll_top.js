// smooth scroll top button
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1000) {
            $('#btn-top').fadeIn('slow')
        } else {
            $('#btn-top').fadeOut('slow')
        }
    });

    $('#btn-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 500)
    });
});