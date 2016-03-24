$(document).ready(function () {

    function PhpComment(element) {
        this.element = element;
        this.init();
    }

    PhpComment.prototype.init = function () {
        this.setupVariables();
        this.setupEvents();
    }

    PhpComment.prototype.setupVariables = function () {
        this.commentForm = this.element.find(".comment-form");
        this.titleField = this.element.find("#comment_title");
        this.bodyField = this.element.find("#comment_body");
    }

    PhpComment.prototype.setupEvents = function () {
        var phpComment = this,
        newMedia;

        $.ajax({
            url: '/media_template.php',
            method: 'GET',
            dataType: 'html',
            success: function (data) {
                newMedia = data;
            }
        });

        phpComment.commentForm.on("submit", function (e) {
            e.preventDefault();
            var parentId = 0,
                title = phpComment.titleField.val(),
                body = phpComment.bodyField.val();

            if(phpComment.commentForm.parents(".media").length > 0){
                parentId = phpComment.commentForm.closest(".media").attr("data-Id");
            }

            $.ajax({
                url: phpComment.commentForm.attr("action"),
                method: 'POST',
                dataType: 'json',
                data: {title: title, body: body, parentId: parentId},
                success: function (data) {
                    if(!data.created){
                        alert("Couldn't create comment");
                        return;
                    }

                    newMedia = newMedia.replace("{{id}}", data.id);
                    newMedia = newMedia.replace("{{title}}", title);
                    newMedia = newMedia.replace("{{body}}", body);
                    newMedia = newMedia.replace("{{nested}}", '');
                    phpComment.commentForm.before(newMedia);
                    phpComment.titleField.val("");
                    phpComment.bodyField.val("");
                }
            });
        });

        $(document).on("click", ".reply-link", function (e) {
            e.preventDefault();
            var media = $(this).closest(".media");
            media.find(">.media-body>.media-text").after(phpComment.commentForm);
        });
    }

    $.fn.phpComment = function (options) {
        new PhpComment(this);
        return this;
    }

    $(".comments").phpComment();

    // Refactor
    // var commentForm = $(".comment-form"),
    //     titleField = $("#comment_title"),
    //     bodyField = $("#comment_body");
    //
    // $(document).on("click", '.reply-link', function () {
    //     var media = $(this).closest('.media');
    //     media.find(">.media-body>.media-text").after(commentForm);
    // });
    //
    // commentForm.on("submit", function (e) {
    //     e.preventDefault();
    //
    //     var parentId = 0,
    //         title = titleField.val(),
    //         body = bodyField.val();
    //
    //     if(commentForm.parents(".media").length > 0){
    //         parentId = commentForm.closest(".media").attr("data-Id");
    //     }
    //
    //     console.log(parentId);
    //     console.log(title);
    //     console.log(body);
    //
    //     $.ajax({
    //         url: commentForm.attr("action"),
    //         data: {title: title, body: body, parentId: parentId},
    //         method: 'POST',
    //         success: function (data) {
    //             var newMedia =
    //                 '<div class="media"> \
    //                   <div class="media-left"> \
    //                     <a href="#"> \
    //                       <img class="media-object" style="width:100px;" src="img/user-icon.jpg" alt="..."> \
    //                     </a> \
    //                   </div> \
    //                   <div class="media-body"> \
    //                     <h4 class="media-heading">{{title}}</h4> \
    //                     <div class=""> \
    //                         <a class="reply-link" href="#">Reply</a> \
    //                     </div> \
    //                     <div  class="media-text" > \
    //                         <p> \
    //                             {{body}} \
    //                         </p> \
    //                     </div> \
    //                   </div> \
    //                 </div>';
    //
    //             newMedia = newMedia.replace("{{title}}", title);
    //             newMedia = newMedia.replace("{{body}}", body);
    //             commentForm.before(newMedia);
    //             titleField.val("");
    //             bodyField.val("");
    //         }
    //     });
    // });
});
