<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Question;
use App\Project;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class QuestionController extends Controller
{
    use Helpers;
    //get all questions for all projects
    public function index()
    {
        $questions = Question::orderBy('project_id', 'DESC')
        ->get()
        ->toArray();

        return $questions;
    }
    //only get one question
    public function show($id)
    {
        $questions = Question::find($id);
        if (!$questions) {
            throw new NotFoundHttpException();
        }

        return $questions;
    }
    //show all questions for 1 project(id)
    public function showperproject($project_id)
    {
        $questions = Question::where('project_id', '=', $project_id)->get();
        if (!$questions) {
            throw new NotFoundHttpException();
        }

        return $questions;
    }
    //create new question
    public function store(Request $request)
    {       //only admins can create new questions
        if ($this->currentUser()['isAdmin']) {
            //only create question for project that exists (also checked front-end)
            if (Project::find($request->get('project_id'))) {
                $question = new Question();
                $question->title = $request->get('title');
                $question->description = $request->get('description');
                $question->possible_answers = $request->get('possible_answers');
                $question->kind = $request->get('kind');
                $question->project_id = $request->get('project_id');
                if ($question->save()) {
                    return $this->response->created();
                } else {
                    return $this->response->error('could_not_create_question', 500);
                }
            } else {
                return $this->response->error('could_not_create_question_unknown_project', 500);
            }
        } else {
            return $this->response->error('could_not_create_question_only_admin', 500);
        }
    }
    //update questions
    public function update(Request $request, $id)
    {       //only admins can change questions
        if ($this->currentUser()['isAdmin']) {
            $question = Question::find($id);
            if (!$question) {
                throw new NotFoundHttpException();
            }
            $question->fill($request->all());
            if ($question->save()) {
                return $this->response->noContent();
            } else {
                return $this->response->error('could_not_update_question', 500);
            }
        } else {
            return $this->response->error('could_not_update_question_only_admin', 500);
        }
    }
    //delete a question
    public function destroy($id)
    {   //only admin can delete
        if ($this->currentUser()['isAdmin']) {
            $question = Question::find($id);
            if (!$question) {
                throw new NotFoundHttpException();
            }
            if ($question->delete()) {
                return $this->response->noContent();
            } else {
                return $this->response->error('could_not_delete_question', 500);
            }
        } else {
            return $this->response->error('could_not_delete_question_only_admin', 500);
        }
    }
    //easy function that returns currently logged in user
    private function currentUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
