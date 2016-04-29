<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{

    protected $fillable = ['answer', 'project_id', 'question_id', 'user_id'];
}
