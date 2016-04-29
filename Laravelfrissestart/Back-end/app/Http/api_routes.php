<?php

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {

	$api->post('auth/login', 'App\Api\V1\Controllers\AuthController@login');
	$api->post('auth/signup', 'App\Api\V1\Controllers\AuthController@signup');
	$api->post('auth/recovery', 'App\Api\V1\Controllers\AuthController@recovery');
	$api->post('auth/reset', 'App\Api\V1\Controllers\AuthController@reset');

	// example of protected route
	$api->get('protected', ['middleware' => ['api.auth'], function () {
		return \App\User::all();
    }]);

	// example of free route
	$api->get('free', function() {
		return \App\User::all();
	});

	$api->group(['middleware' => 'api.auth'], function ($api) {
	$api->post('projects', 'App\Api\V1\Controllers\ProjectController@store');
	$api->put('projects/{id}', 'App\Api\V1\Controllers\ProjectController@update');
	$api->delete('projects/{id}', 'App\Api\V1\Controllers\ProjectController@destroy');
});
$api->get('projects', 'App\Api\V1\Controllers\ProjectController@index');
$api->get('projects/{id}', 'App\Api\V1\Controllers\ProjectController@show');
});
