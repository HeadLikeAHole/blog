// modal script
// check if template contains open-modal class so if it doesn't error isn't raised
if (document.getElementsByClassName('open-modal')[0]) {
    // get the modal
    const modal = document.getElementById('modal');

    // get the button that opens the modal
    const openModal = document.getElementsByClassName('open-modal')[0];

    // get the button that closes the modal
    const closeModal = document.getElementsByClassName('close-modal')[0];

    // when the user clicks the open button, open the modal
    openModal.onclick =  function () {
        modal.style.display = 'block';
    };

    // when the user clicks the close button, close the modal
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
// end of modal script


// navbar slide
// get burger div
const burger = document.querySelector('.burger');
// get navbar links to the right (right part of the bar)
const nav = document.querySelector('.right-bar');
// get right-bar's links an array to iterate over
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
// end of navbar slide


// get CSRF token using jQuery (from django docs)
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
// end of get CSRF token


$(document).ready(function () {
    // slide up message after 5 seconds
    setTimeout(function () {
        // takes 2s to slide up
        $('.message').slideUp(2000)
    }, 5000);
    // end of slide up message


    // smooth scroll top button
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
    // end of smooth scroll top button


    // comments scripts
    // after comment is submitted through api comment content persists in textarea field after page reload
    // clear text area on page reload
    $('.comment-section textarea').val('');

    // cache selector in a variable to improve performance
    var $commentSection = $('.comment-section');

    // like button handler
    // comment-section is selected to delegate event handlers to its children
    // since after every api call comment-section div is replaced by django view and event handlers don't persist
    $commentSection.on('click', '.btn-like', function () {
        // bind "this" to "on" function scope
        var $this = $(this);
        $.ajax({
            // url is contained in data-api-like-url attribute in template, api-like-url method is defined in Post model
            url: $this.attr('data-api-like-url'),
            dataType: 'json',
            // data returned by PostLikeAPI view
            success: function (data) {
                var newLikes;
                // total amount of likes
                var likesCount = parseInt(data.likes_count);
                // toggle between like and unlike buttons and add or remove a like
                if (data.authenticated) {
                    if (data.add_like) {
                        newLikes = likesCount + 1;
                        $this.text(newLikes + ' ' + 'Unlike')
                    } else {
                        newLikes = likesCount - 1;
                        $this.text(newLikes + ' ' + 'Like')
                    }
                }
            },
            error: function (response) {
                console.log(response.responseText)
            }
        })
    });

    // save link
    $commentSection.on('click', '.save', function (e) {
        e.preventDefault();
        // bind "this" to "on" function scope
        var $this = $(this);
        $.ajax({
            // url is contained in data-api-save-url attribute in template, api-save-url method is defined in Post model
            url: $this.attr('data-api-save-url'),
            dataType: 'json',
            // data returned by PostSaveAPI view
            success: function (data) {
                // toggle between save and unsave links
                if (data.authenticated) {
                    if (data.saved) {
                        $this.text('Unsave')
                    } else {
                        $this.text('Save')
                    }
                }
            },
            error: function (response) {
                console.log(response.responseText)
            }
        })
    });

    // follow button
    $('.follow').on('click', function () {
        // bind "this" to "on" function scope
        var $this = $(this);
        $.ajax({
            // url is contained in data-api-follow-pk attribute in template, api-follow-pk method is defined in Profile model
            url: $this.attr('data-api-follow-pk'),
            dataType: 'json',
             // data returned by UserFollowAPI view
            success: function (data) {
                // toggle between blue follow and red unfollow buttons
                if (data.authenticated) {
                    if (data.following) {
                        $this.addClass('btn-red').removeClass('btn-blue');
                        $this.text('Unfollow')
                    } else {
                        $this.addClass('btn-blue').removeClass('btn-red');
                        $this.text('Follow')
                    }
                }
            },
            error: function (response) {
                console.log(response.responseText)
            }
        })
    });

    // add comment or reply
    $commentSection.on('submit', '.comment-form, .reply-form', function (event) {
        event.preventDefault();
        $.ajax({
            // url is "." that is current page
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            // json response by post_detail view
            success: function (response) {
                // update in frontend comments.html sent by post_detail view
                $commentSection.html(response['html']);
                // reset textarea
                $('textarea').val('');
            },
            error: function (response) {
                console.log(response.responseText)
            }
        })
    });

    // open edit comment form
    $commentSection.on('click', '.comment-edit', function (event) {
        event.preventDefault();
        // cache selector in a variable to improve performance
        var $this = $(this);
        // grab comment text
        var text = $this.parent().prev().text();
        // show text area
        $this.parent().parent().next().show();
        // replace placeholder from "add a comment" tp "edit your comment"
        // insert text into text area for editing
        // focus on textarea
        $this.parent().parent().next().children(':nth-child(4)').attr('placeholder', 'Edit your comment...').val(text).focus();
        // hide "edit-hide" div which contains comment information not nesassary during editing
        $this.parent().parent().hide();
    });

    // close comment form
    $commentSection.on('click', '.comment-cancel', function (event) {
        event.preventDefault();
        // show comment information ("edit-hide" div)
        $(this).parent().parent().prev().show();
        // hide textarea
        $(this).parent().parent().hide()
    });

    // save changes after editing comment
    $commentSection.on('submit', '.comment-edit-form', function (event) {
        event.preventDefault();
        $.ajax({
            // url is "." that is current page
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            // json response by post_detail view
            success: function (response) {
                // update in frontend comments.html sent by post_detail view
                $commentSection.html(response['html']);
                // remove text from the form
                $('textarea').val('');
            },
            error: function (response) {
                console.log(response.responseText)
            }
        })
    });

    // open comment delete confirmation
    $commentSection.on('click', '.comment-delete', function (event) {
        event.preventDefault();
        // show comment delete confirmation
        $(this).next().css('display', 'inline');
        // hide delete link
        $(this).hide();
    });

    // close comment delete confirmation
    $commentSection.on('click', '.no', function (event) {
        event.preventDefault();
        // hide comment delete confirmation
        $(this).parent().hide();
        // show delete link
        $(this).parent().prev().show()
    });

    // submit comment delete form when clicking "yes" link
    $commentSection.on('click', '.yes', function (event) {
        event.preventDefault();
        $(this).parent().submit()
    });

    // delete comment
    $commentSection.on('submit', '.comment-delete-form', function (event) {
        event.preventDefault();
        $.ajax({
            // url is "." that is current page
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            // json response by post_detail view
            success: function (response) {
                // update in frontend comments.html sent by post_detail view
                $commentSection.html(response['html']);
            },
            error: function (response) {
                console.log(response.responseText)
            }
        })
    });

    // show reply form on reply button click
    $commentSection.on('click', '.reply-btn', function (event) {
        event.preventDefault();
        // grab reply textarea and change placeholder
        $(this).parent().next().children(':nth-child(3)').attr('placeholder', 'Add a reply...');
        // show hide reply textarea
        $(this).parent().next().toggle();
    });
    // end of comments scripts
});
