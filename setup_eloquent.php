<?php
require 'vendor/autoload.php';

use \Illuminate\Database\Capsule\Manager as Capsule;
use \Illuminate\Events\Dispatcher;
use \Illuminate\Container\Container;

date_default_timezone_set('Europe/London');

$container = new Container;
$capsule = new Capsule;

$capsule->addConnection([
'driver'    => 'mysql',
'host'      => 'localhost',
'database'  => 'php_comment',
'username'  => 'root',
'password'  => 'vicecity',
'charset'   => 'utf8',
'collation' => 'utf8_unicode_ci',
'prefix'    => '',
]);

$capsule->setEventDispatcher(new Dispatcher($container));
$capsule->setAsGlobal();
$capsule->bootEloquent();

/**
 *
 */
class Comment extends Illuminate\Database\Eloquent\Model
{

    protected $fillable = ['title', 'body', 'parent_id'];

    public static $mediaTemplate;

    public static function boot(){
        parent::boot();
        self::$mediaTemplate = file_get_contents(__DIR__.'/media_template.php');
    }

    public function outputComment()
    {
        $media = self::$mediaTemplate;
        $media = str_replace("{{id}}", $this->id, $media);
        $media = str_replace("{{title}}", $this->title, $media);
        $media = str_replace("{{body}}", $this->body, $media);

        $nestedComments = $this->outputNestedComments();

        $media = str_replace("{{nested}}", $nestedComments, $media);

        return $media;
    }

    public function outputNestedComments()
    {
        $media = '';
        if($this->children()->count() > 0){
            foreach ($this->children as $comment) {
                $media = $media.$comment->outputComment();
            }
        }

        return $media;
    }

    public function children()
    {
        return $this->hasMany('Comment', 'parent_id', 'id');
    }

    public function parent()
    {
        return $this->belongsTo('Comment', 'parent_id', 'id');
    }
}
?>
