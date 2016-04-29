<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description', 'startdate', 'enddate', 'category', 'location'];


    public function questions()
{
    return $this->hasMany('App\Question');
}
}
