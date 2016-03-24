<?php
require("setup_eloquent.php");

$parentId = $_POST['parentId'];
$title = $_POST['title'];
$body = $_POST['body'];

$comment = Comment::create([
    'title' => $title,
    'body' => $body,
    'parent_id' => $parentId
]);

if($comment){
    echo json_encode([
        'created' => true,
        'id' => $comment->id
    ]);
}
else{
    echo json_encode([
        'created' => false
    ]);
}
?>
