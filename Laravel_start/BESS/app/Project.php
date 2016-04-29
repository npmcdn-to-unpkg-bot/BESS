<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    //
    protected $fillable = [
        'name', 'description', 'startdate', 'enddate', 'location',
    ];
    // protected $fillable = ['name'];
    // protected $fillable = ['description'];
    // protected $fillable = ['startdate'];
    // protected $fillable = ['enddate'];
    // protected $fillable = ['location'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
