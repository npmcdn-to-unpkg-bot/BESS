<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description', 'startdate', 'enddate', 'category', 'location', 'latitude', 'longitude'];


    public function questions()
{
    return $this->hasMany('App\Question');
}
public function answers()
{
    return $this->hasMany('App\Answer');
}

public function timelines()
{
    return $this->hasMany('App\Timeline');
}
public function images()
{
    return $this->hasMany('App\Image');
}
}
