$(document).ready(function () {

    // cache selector in a variable to improve performance:
    var $commentSection = $('.comment-section');

    // like button handler
    $commentSection.on('click', '.btn-like', function () {
        var $this = $(this);
        $.ajax({
            url: $this.attr('data-api-like-url'),
            dataType: 'json',
            success: function (data) {
                var newLikes;
                var likesCount = parseInt(data.likes_count);
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

    // add comment or reply
    $commentSection.on('submit', '.comment-form, .reply-form', function (event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                $commentSection.html(response['html']);
                // remove text from the form
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
        var $this = $(this);
        var text = $this.prev().text();
        $this.parent().next().show();
        $this.parent().next().children(':nth-child(4)').attr('placeholder', 'Edit your comment...').val(text).focus();
        $this.parent().hide();
    });

    // close comment form
    $commentSection.on('click', '.comment-cancel', function (event) {
        event.preventDefault();
        $(this).parent().parent().prev().show();
        $(this).parent().parent().hide()
    });

    // save changes after editing comment
    $commentSection.on('submit', '.comment-edit-form', function (event) {
        event.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
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
        $(this).next().css('display', 'inline');
        $(this).hide();
    });

    // close comment delete confirmation
    $commentSection.on('click', '.no', function (event) {
        event.preventDefault();
        $(this).parent().hide();
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
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
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
        $(this).next().children(':nth-child(3)').attr('placeholder', 'Add a reply...');
        $(this).next().toggle();
    });

});