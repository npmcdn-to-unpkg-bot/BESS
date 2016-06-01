<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Timeline extends Model
{
    //
    protected $fillable = ['title', 'description', 'date', 'project_id'];
}
