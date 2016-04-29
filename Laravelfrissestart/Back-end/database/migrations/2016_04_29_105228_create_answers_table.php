<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnswersTable extends Migration
{
  /**
  * Run the migrations.
  *
  * @return void
  */
  public function up()
  {
    Schema::create('answers', function (Blueprint $table) {
      $table->increments('id');
      $table->string('answer');
      $table->integer('project_id')->index();
      $table->integer('question_id')->index();
      $table->integer('user_id')->index();
      $table->timestamps();
    });
  }

  /**
  * Reverse the migrations.
  *
  * @return void
  */
  public function down()
  {
    Schema::drop('answers');
  }
}
