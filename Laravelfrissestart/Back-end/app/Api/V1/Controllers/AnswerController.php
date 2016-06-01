<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Answer;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AnswerController extends Controller
{
    use Helpers;
    //get all the answers.
    public function index()
    {       //only admin can get all the answers
        if ($this->currentUser()['isAdmin']) {
            $answers = Answer::orderBy('project_id', 'DESC')
            ->get()
            ->toArray();

            return $answers;
        } else {
            return $this->response->error('could_not_get_answers_only_admin', 500);
        }
    }

    //return logged in users answers
    public function indexuser()
    {
        return $this->currentUser()
        ->answers()
        ->orderBy('created_at', 'DESC')
        ->get()
        ->toArray();
    }
    //get an answer by id, only admin
    public function show($id)
    {
        if ($this->currentUser()['isAdmin']) {
            $answer = Answer::find($id);
            if (!$answer) {
                throw new NotFoundHttpException();
            }

            return $answer;
        } else {
            return $this->response->error('could_not_get_answer_only_admin', 500);
        }
    }
    //Get answer per project only admin
    public function showperproject($project_id)
    {
        if ($this->currentUser()['isAdmin']) {
            $answers = Answer::where('project_id', '=', $project_id)->get();
            if (!$answers) {
                throw new NotFoundHttpException();
            }
            return $answers;
        } else {
            return $this->response->error('could_not_get_answers_per_project_only_admin', 500);
        }
    }
    //Get answers per answer id for logged in user
    public function showuser($id)
    {
        $answer = $this->currentUser()->answers()->find($id);
        if (!$answer) {
            throw new NotFoundHttpException();
        }

        return $answer;
    }
    //Store answer for logged in user
    public function store(Request $request)
    {   //only one answer per question per user so first or create is used
        $answer = Answer::firstOrCreate(['question_id' => $request->get('question_id'), 'user_id' => $this->currentUser()['id']]);
        $answer->answer = $request->get('answer');
        $answer->project_id = $request->get('project_id');
        $answer->question_id = $request->get('question_id');
  //$answer->user_id = $this->currentUser()->get('user_id');
  if ($this->currentUser()->answers()->save($answer)) {
      return $this->response->created();
  } else {
      return $this->response->error('could_not_create_answer', 500);
  }
    }

    //update users answer but is not used because replaced by store function that can also update
    public function update(Request $request, $id)
    {
        $answer = $this->currentUser()->answers()->find($id);
        if (!$answer) {
            throw new NotFoundHttpException();
        }
        $answer->fill($request->all());
        if ($answer->save()) {
            return $this->response->noContent();
        } else {
            return $this->response->error('could_not_update_answer', 500);
        }
    }
    //delete answer.
    public function destroy($id)
    {
        $answer = $this->currentUser()->answers()->find($id);
        if (!$answer) {
            throw new NotFoundHttpException();
        }
        if ($answer->delete()) {
            return $this->response->noContent();
        } else {
            return $this->response->error('could_not_delete_answer', 500);
        }
    }
    //easy function that returns currently logged in user
    private function currentUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
