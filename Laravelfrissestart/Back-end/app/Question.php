<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['title', 'description', 'possible_answers', 'kind', 'project_id'];
    public function answers()
    {
        return $this->hasMany('App\Answer');
    }
}
