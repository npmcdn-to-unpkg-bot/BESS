<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Comment;
use App\Project;
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
        if (!$comments) {
            throw new NotFoundHttpException();
        }

        return $comments;
    }
    //show comments per project
    public function showperproject($project_id)
    {
        $comments = Comment::where('project_id', '=', $project_id)->orderBy('created_at', 'DESC')->get();
        if (!$comments) {
            throw new NotFoundHttpException();
        }

        return $comments;
    }
    //create a new comment only for a project that exists
    public function store(Request $request)
    {
        if (Project::find($request->get('project_id'))) {
            $comments = new Comment();
            $comments->comment = $request->get('comment');

            if (JWTAuth::getToken()) {
                // if user is logged in name will be set for comment
                if ($this->currentUser()) {
                    $comments->username = $this->currentUser()['firstname'].' '.$this->currentUser()['name'];
                    $comments->user_id = $this->currentUser()['id'];
                }
                //else the comment wil be anonimously
            } else {
                $comments->username = 'Anoniem';
            }

            $comments->project_id = $request->get('project_id');
            if ($comments->save()) {
                return $this->response->created();
            } else {
                return $this->response->error('could_not_create_comment', 500);
            }
        } else {
            // return this message if comment was created for project that does not exist.
            //normally this is not possible because front end does not allow to create a comment for an unknown project
            return $this->response->error('could_not_create_comment_unknown_project', 500);
        }
    }
            // update function is left out because comments should not be edited but is still available here if needed

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

            //only admins can delete message because of hate messages or profanity or something else.
            public function destroy($id)
            {
                if ($this->currentUser()['isAdmin']) {
                    $comments = Comment::find($id);
                    if (!$comments) {
                        throw new NotFoundHttpException();
                    }
                    if ($comments->delete()) {
                        return $this->response->noContent();
                    } else {
                        return $this->response->error('could_not_delete_comment', 500);
                    }
                } else {
                    return $this->response->error('could_not_delete_comment_only_admin', 500);
                }
            }
            
    //easy function that returns currently logged in user
    private function currentUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
