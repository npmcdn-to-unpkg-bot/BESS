<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['username', 'comment', 'project_id', 'user_id'];
}
