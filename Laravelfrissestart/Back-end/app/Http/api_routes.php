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
		// projects routing api met auth
		$api->get('projects/user', 'App\Api\V1\Controllers\ProjectController@indexuser');
		$api->get('projects/user/{id}', 'App\Api\V1\Controllers\ProjectController@showuser');
		$api->post('projects', 'App\Api\V1\Controllers\ProjectController@store');
		$api->put('projects/{id}', 'App\Api\V1\Controllers\ProjectController@update');
		$api->delete('projects/{id}', 'App\Api\V1\Controllers\ProjectController@destroy');

		// question routing api met auth
		$api->post('questions', 'App\Api\V1\Controllers\QuestionController@store');
		$api->put('questions/{id}', 'App\Api\V1\Controllers\QuestionController@update');
		$api->delete('questions/{id}', 'App\Api\V1\Controllers\QuestionController@destroy');
	});
	// projects routing api zonder auth
	$api->get('projects', 'App\Api\V1\Controllers\ProjectController@index');
	$api->get('projects/{id}', 'App\Api\V1\Controllers\ProjectController@show');

	// question routing api zonder auth
	$api->get('questions', 'App\Api\V1\Controllers\QuestionController@index');
	$api->get('questions/{id}', 'App\Api\V1\Controllers\QuestionController@show');
	$api->get('questions/project/{id}', 'App\Api\V1\Controllers\QuestionController@showperproject');
});
