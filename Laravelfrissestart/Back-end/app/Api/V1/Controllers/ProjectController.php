<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Project;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProjectController extends Controller
{
    use Helpers;
    //get all projects
    public function index()
    {
        $projects = Project::orderBy('created_at', 'DESC')
        ->get()
        ->toArray();

        return $projects;
    }
    //get all projects per user who created them (not used)
    public function indexuser()
    {
        return $this->currentUser()
                ->projects()
                ->orderBy('created_at', 'DESC')
                ->get()
                ->toArray();
    }
    // show project for one projectid (for project page)
    public function show($id)
    {
        $project = Project::find($id);
        if (!$project) {
            throw new NotFoundHttpException();
        }

        return $project;
    }

    public function showuser($id)
    {
        $project = $this->currentUser()->projects()->find($id);
        if (!$project) {
            throw new NotFoundHttpException();
        }

        return $project;
    }
    //add new project
    public function store(Request $request)
    {       //only admin can create projects
        if ($this->currentUser()['isAdmin']) {
            $project = new Project();
            $project->name = $request->get('name');
            $project->description = $request->get('description');
            $project->startdate = $request->get('startdate');
            $project->enddate = $request->get('enddate');
            $project->category = $request->get('category');
            $project->location = $request->get('location');
            $project->latitude = $request->get('latitude');
            $project->longitude = $request->get('longitude');
            if ($this->currentUser()->projects()->save($project)) {
                return $this->response->created();
            } else {
                return $this->response->error('could_not_create_project', 500);
            }
        } else {
            return $this->response->error('could_not_create_project_only_admin', 500);
        }
    }
    //change project
    public function update(Request $request, $id)
    {       //only admin
        if ($this->currentUser()['isAdmin']) {
            $project = Project::find($id);
            if (!$project) {
                throw new NotFoundHttpException();
            }
            $project->fill($request->all());
            if ($project->save()) {
                return $this->response->noContent();
            } else {
                return $this->response->error('could_not_update_project', 500);
            }
        } else {
            return $this->response->error('could_not_update_project_only_admin', 500);
        }
    }
    //delete project
    public function destroy($id)
    {       //only admin can delete
        if ($this->currentUser()['isAdmin']) {
            $project = Project::find($id);
            if (!$project) {
                throw new NotFoundHttpException();
            }
            if ($project->delete()) {
                return $this->response->noContent();
            } else {
                return $this->response->error('could_not_delete_project', 500);
            }
        } else {
            return $this->response->error('could_not_delete_project_only_admin', 500);
        }
    }
    //easy function that returns currently logged in user
    private function currentUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
