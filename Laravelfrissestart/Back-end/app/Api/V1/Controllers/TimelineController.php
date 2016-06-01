<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Timeline;
use App\Project;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TimelineController extends Controller
{
    use Helpers;
    public function index()
    {
        $timelines = Timeline::orderBy('project_id', 'DESC')
            ->get()
            ->toArray();

        return $timelines;
    }

    public function show($id)
    {
        $timelines = Timeline::find($id);
        if (!$timelines) {
            throw new NotFoundHttpException();
        }

        return $timelines;
    }
    //show timelines per project
    public function showperproject($project_id)
    {
        $timelines = Timeline::where('project_id', '=', $project_id)->orderBy('date', 'DESC')->get();
        if (!$timelines) {
            throw new NotFoundHttpException();
        }

        return $timelines;
    }

    public function store(Request $request)
    {   //only admin can create new timeline items
        if ($this->currentUser()['isAdmin']) {
          //only timeline items for projects that exists
            if (Project::find($request->get('project_id'))) {
                $timeline = new Timeline();
                $timeline->title = $request->get('title');
                $timeline->description = $request->get('description');

                $timeline->date = $request->get('date');

                $timeline->project_id = $request->get('project_id');
                if ($timeline->save()) {
                    return $this->response->created();
                } else {
                    return $this->response->error('could_not_create_timeline', 500);
                }
            } else {
                return $this->response->error('could_not_create_timeline_unknown_project', 500);
            }
        } else {
            return $this->response->error('could_not_create_timeline_only_admin', 500);
        }
    }

    public function update(Request $request, $id)
    {   //only admin can change timeline items
        if ($this->currentUser()['isAdmin']) {
            $timeline = Timeline::find($id);
            if (!$timeline) {
                throw new NotFoundHttpException();
            }
            $timeline->fill($request->all());
            if ($timeline->save()) {
                return $this->response->noContent();
            } else {
                return $this->response->error('could_not_update_timeline', 500);
            }
        } else {
            return $this->response->error('could_not_update_timeline_only_admin', 500);
        }
    }
    public function destroy($id)
    {   //only admin
        if ($this->currentUser()['isAdmin']) {
            $timeline = Timeline::find($id);
            if (!$timeline) {
                throw new NotFoundHttpException();
            }
            if ($timeline->delete()) {
                return $this->response->noContent();
            } else {
                return $this->response->error('could_not_delete_timeline', 500);
            }
        } else {
            return $this->response->error('could_not_delete_timeline_only_admin', 500);
        }
    }
    //easy function that returns currently logged in user
    private function currentUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
