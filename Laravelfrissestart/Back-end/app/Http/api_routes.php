<?php

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {
	$api->group(['middleware' => ['cors']], function ($api) {
$api->post('auth/login', 'App\Api\V1\Controllers\AuthController@login');
$api->post('auth/signup', 'App\Api\V1\Controllers\AuthController@signup');
$api->post('auth/recovery', 'App\Api\V1\Controllers\AuthController@recovery');
$api->post('auth/reset', 'App\Api\V1\Controllers\AuthController@reset');

	});



	// example of protected route
	$api->get('user', ['middleware' => ['api.auth', 'cors'], function () {
		//return \App\User::all();
		return JWTAuth::parseToken()->authenticate();
	}]);

	// example of free route
	// $api->get('free', function() {
	// 	return \App\User::all();
	// });

	$api->group(['middleware' => ['api.auth', 'cors']], function ($api) {
		$api->post('user/changepassword', 'App\Api\V1\Controllers\UserController@changePassword');
		// projects routing api met auth
		$api->get('projects/user', 'App\Api\V1\Controllers\ProjectController@indexuser');
		$api->get('projects/user/{id}', 'App\Api\V1\Controllers\ProjectController@showuser');
		$api->post('projects', 'App\Api\V1\Controllers\ProjectController@store');
		$api->post('projects/{id}', 'App\Api\V1\Controllers\ProjectController@update');
		$api->delete('projects/{id}', 'App\Api\V1\Controllers\ProjectController@destroy');

		// question routing api met auth
		$api->post('questions', 'App\Api\V1\Controllers\QuestionController@store');
		$api->post('questions/{id}', 'App\Api\V1\Controllers\QuestionController@update');
		$api->delete('questions/{id}', 'App\Api\V1\Controllers\QuestionController@destroy');

		// timeline routing api met auth
		$api->post('timelines', 'App\Api\V1\Controllers\TimelineController@store');
		$api->post('timelines/{id}', 'App\Api\V1\Controllers\TimelineController@update');
		$api->delete('timelines/{id}', 'App\Api\V1\Controllers\TimelineController@destroy');

		//answers routing api met auth

		$api->get('answers/user', 'App\Api\V1\Controllers\AnswerController@indexuser');
		$api->get('answers/user/{id}', 'App\Api\V1\Controllers\AnswerController@showuser');
		$api->post('answers', 'App\Api\V1\Controllers\AnswerController@store');
		$api->post('answers/{id}', 'App\Api\V1\Controllers\AnswerController@update');
		$api->delete('answers/{id}', 'App\Api\V1\Controllers\AnswerController@destroy');

		// Answers routing api zonder auth
		$api->get('answers', 'App\Api\V1\Controllers\AnswerController@index');
		$api->get('answers/{id}', 'App\Api\V1\Controllers\AnswerController@showperproject');

		//image routing met auth
		$api->post('image/add/{id}', 'App\Api\V1\Controllers\ImageController@add');

		//comment routing met auth
		$api->delete('comments/{id}', 'App\Api\V1\Controllers\CommentController@destroy');
	});

		$api->group(['middleware' => ['cors']], function ($api) {

			// projects routing api zonder auth
			$api->get('projects', 'App\Api\V1\Controllers\ProjectController@index');
			$api->get('projects/{id}', 'App\Api\V1\Controllers\ProjectController@show');

			// question routing api zonder auth
			$api->get('questions', 'App\Api\V1\Controllers\QuestionController@index');
			$api->get('questions/{id}', 'App\Api\V1\Controllers\QuestionController@show');
			$api->get('questions/project/{id}', 'App\Api\V1\Controllers\QuestionController@showperproject');

			// timeline routing api zonder auth
			$api->get('timelines', 'App\Api\V1\Controllers\TimelineController@index');
			$api->get('timelines/{id}', 'App\Api\V1\Controllers\TimelineController@show');
			$api->get('timelines/project/{id}', 'App\Api\V1\Controllers\TimelineController@showperproject');



				//images routing zonder auth
				$api->get('image', 'App\Api\V1\Controllers\ImageController@index');
				$api->get('image/project/{id}', 'App\Api\V1\Controllers\ImageController@get');

				//comment routing zonder auth
				$api->post('comments', 'App\Api\V1\Controllers\CommentController@store');

				$api->get('comments', 'App\Api\V1\Controllers\CommentController@index');
				$api->get('comments/project/{id}', 'App\Api\V1\Controllers\CommentController@showperproject');


		});

});
