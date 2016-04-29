<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Question;
use App\Project;
use App\Answer;
use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AnswerController extends Controller
{
    use Helpers;
    public function index()
    {
        $answers = Answer::orderBy('project_id', 'DESC')
        ->get()
        ->toArray();
        return $answers;
    }

        public function indexuser()
        {
            return $this->currentUser()
                ->answers()
                ->orderBy('created_at', 'DESC')
                ->get()
                ->toArray();
        }

    public function show($id)
    {
        $answer = Answer::find($id);
        if(!$answer)
            throw new NotFoundHttpException;
        return $answer;
    }

      public function showuser($id)
      {
          $answer = $this->currentUser()->answers()->find($id);
          if(!$answer)
              throw new NotFoundHttpException;
          return $answer;
      }
    public function store(Request $request)
    {
      $answer = new Answer;
      $answer->answer = $request->get('answer');
      $answer->project_id = $request->get('project_id');
      $answer->question_id = $request->get('question_id');
      //$answer->user_id = $this->currentUser()->get('user_id');
      if($this->currentUser()->answers()->save($answer))
          return $this->response->created();
      else
          return $this->response->error('could_not_create_answer', 500);
    }
    public function update(Request $request, $id)
    {
        $answer = $this->currentUser()->answers()->find($id);
        if(!$answer)
            throw new NotFoundHttpException;
        $answer->fill($request->all());
        if($answer->save())
            return $this->response->noContent();
        else
            return $this->response->error('could_not_update_answer', 500);
    }
    public function destroy($id)
    {
        $answer = $this->currentUser()->answers()->find($id);
        if(!$answer)
            throw new NotFoundHttpException;
        if($answer->delete())
            return $this->response->noContent();
        else
            return $this->response->error('could_not_delete_answer', 500);
    }
    private function currentUser() {
        return JWTAuth::parseToken()->authenticate();
    }
}
