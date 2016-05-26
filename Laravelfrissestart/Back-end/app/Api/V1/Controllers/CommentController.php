<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Comment;
use App\Project;
use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CommentController extends Controller
{
            use Helpers;
            public function index()
            {
                $comments = Comment::orderBy('project_id', 'DESC')
                ->get()
                ->toArray();
                return $comments;
            }


            public function show($id)
            {
                $comments = Comment::find($id);
                if(!$comments)
                    throw new NotFoundHttpException;
                return $comments;
            }

              public function showperproject($project_id)
              {
                  $comments = Comment::where('project_id', '=' ,$project_id)->orderBy('created_at', 'DESC')->get();
                  if(!$comments)
                      throw new NotFoundHttpException;
                  return $comments;
              }
            public function store(Request $request)
            {
              if (Project::find($request->get('project_id'))) {
                $comments = new Comment;
                $comments->comment = $request->get('comment');
                if (JWTAuth::getToken()) {
                  if ($this->currentUser()) {
                    $comments->username = $this->currentUser()["firstname"]." ".$this->currentUser()["name"];
                    $comments->user_id = $this->currentUser()["id"];
                  }


                } else {
                  $comments->username = "Anoniem";
                }

                $comments->project_id = $request->get('project_id');
                if($comments->save())
                    return $this->response->created();
                else
                    return $this->response->error('could_not_create_question', 500);
              }
              else
              return $this->response->error('could_not_create_question_unknown_project', 500);



            }
            // public function update(Request $request, $id)
            // {   if ($this->currentUser()["isAdmin"]){
            //   $timeline = Timeline::find($id);
            //   if(!$timeline)
            //       throw new NotFoundHttpException;
            //   $timeline->fill($request->all());
            //   if($timeline->save())
            //       return $this->response->noContent();
            //   else
            //       return $this->response->error('could_not_update_timeline', 500);
            // }
            // else
            // return $this->response->error('could_not_update_timeline_only_admin', 500);
            // }
            public function destroy($id)
            {   if ($this->currentUser()["isAdmin"]){
              $comments = Comment::find($id);
              if(!$comments)
                  throw new NotFoundHttpException;
              if($comments->delete())
                  return $this->response->noContent();
              else
                  return $this->response->error('could_not_delete_comment', 500);
            }
            else
            return $this->response->error('could_not_delete_comment_only_admin', 500);
            }
            private function currentUser() {
                return JWTAuth::parseToken()->authenticate();
            }
}
