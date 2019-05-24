$(document).ready(function () {
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

});