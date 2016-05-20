<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Project;
use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProjectController extends Controller
{
    use Helpers;
    public function index()
    {
        $projects = Project::orderBy('created_at', 'DESC')
        ->get()
        ->toArray();
        return $projects;
    }

        public function indexuser()
        {
            return $this->currentUser()
                ->projects()
                ->orderBy('created_at', 'DESC')
                ->get()
                ->toArray();
        }

    public function show($id)
    {
        $project = Project::find($id);
        if(!$project)
            throw new NotFoundHttpException;
        return $project;
    }

      public function showuser($id)
      {
          $project = $this->currentUser()->projects()->find($id);
          if(!$project)
              throw new NotFoundHttpException;
          return $project;
      }
    public function store(Request $request)
    {   if ($this->currentUser()["isAdmin"]) {
      $project = new Project;
      $project->name = $request->get('name');
      $project->description = $request->get('description');
      $project->startdate = $request->get('startdate');
      $project->enddate = $request->get('enddate');
      $project->category = $request->get('category');
      $project->location = $request->get('location');
      if($this->currentUser()->projects()->save($project))
          return $this->response->created();
      else
          return $this->response->error('could_not_create_project', 500);
    }
    else
    return $this->response->error('could_not_create_project_only_admin', 500);

    }
    public function update(Request $request, $id)
    {   if ($this->currentUser()["isAdmin"]) {
        $project = Project::find($id);
        if(!$project)
            throw new NotFoundHttpException;
        $project->fill($request->all());
        if($project->save())
            return $this->response->noContent();
        else
            return $this->response->error('could_not_update_project', 500);
            }
            else
            return $this->response->error('could_not_create_project_only_admin', 500);
    }
    public function destroy($id)
    {
        $project = $this->currentUser()->projects()->find($id);
        if(!$project)
            throw new NotFoundHttpException;
        if($project->delete())
            return $this->response->noContent();
        else
            return $this->response->error('could_not_delete_project', 500);
    }
    private function currentUser() {
        return JWTAuth::parseToken()->authenticate();
    }
}
