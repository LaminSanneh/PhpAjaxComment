<?php
require("setup_eloquent.php");

$comments = Comment::with('children')->where('parent_id', 0)->get();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Comment System</title>
        <link rel="stylesheet" href="/css/bootstrap.css" media="screen" title="no title" charset="utf-8">
    </head>
    <body>
        <div class="container">
            <div class="row comments">
                <?php foreach($comments as $comment): ?>
                    <?php echo $comment->outputComment(); ?>
                <?php endforeach; ?>
              <form class="comment-form" action="process.php" method="post">
                  <div class="form-group">
                      <label for="comment_title">Title</label>
                      <input type="text" id="comment_title" name="comment_title" class="form-control" value="">
                  </div>
                  <div class="form-group">
                      <label for="comment_body">Body</label>
                      <textarea name="comment_body" id="comment_body" class="form-control" rows="8" cols="40"></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary pull-right" >Submit</button>
              </form>
            </div>
        </div>
    <script type="text/javascript" src="js/jquery.js" ></script>
    <script type="text/javascript" src="js/main.js" ></script>
    </body>
</html>
