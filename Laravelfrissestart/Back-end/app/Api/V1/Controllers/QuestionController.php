<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Question;
use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class QuestionController extends Controller
{
    use Helpers;
    public function index()
    {
        $questions = Question::orderBy('created_at', 'DESC')
        ->get()
        ->toArray();
        return $questions;
    }


    public function show($id)
    {
        $questions = Question::find($id);
        if(!$questions)
            throw new NotFoundHttpException;
        return $questions;
    }

      public function showperproject($project_id)
      {
          $questions = Question::find($project_id);
          if(!$questions)
              throw new NotFoundHttpException;
          return $questions;
      }
    public function store(Request $request)
    {   if ($this->currentUser()["isAdmin"]) {
      $question = new Question;
      $question->title = $request->get('title');
      $question->description = $request->get('description');
      // possible answers moet geserialized worden met php en dan als je het wilt gebruiken unserializen
      $question->possible_answers = $request->get('possible_answers');
      $question->kind = $request->get('kind');
      $question->project_id = $request->get('project_id');
      if($question->save())
          return $this->response->created();
      else
          return $this->response->error('could_not_create_question', 500);
    }
    else
    return $this->response->error('could_not_create_question_only_admin', 500);

    }
    public function update(Request $request, $id)
    {   if ($this->currentUser()["isAdmin"]){
      $question = Question::find($id);
      if(!$question)
          throw new NotFoundHttpException;
      $question->fill($request->all());
      if($question->save())
          return $this->response->noContent();
      else
          return $this->response->error('could_not_update_question', 500);
    }
    else
    return $this->response->error('could_not_update_question_only_admin', 500);
    }
    public function destroy($id)
    {   if ($this->currentUser()["isAdmin"]){
      $question = Question::find($id);
      if(!$question)
          throw new NotFoundHttpException;
      if($question->delete())
          return $this->response->noContent();
      else
          return $this->response->error('could_not_delete_question', 500);
    }
    else
    return $this->response->error('could_not_delete_question_only_admin', 500);       
    }
    private function currentUser() {
        return JWTAuth::parseToken()->authenticate();
    }
}
