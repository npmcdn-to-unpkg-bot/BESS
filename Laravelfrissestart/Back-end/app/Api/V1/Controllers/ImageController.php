<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Image;
use App\Project;
use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class ImageController extends Controller
{
  public function index()
  {

    $images = Image::orderBy('project_id', 'DESC')
    ->get()
    ->toArray();
    return $images;
  }

  public function add($id) {
    if ($this->currentUser()["isAdmin"]) {

    $file = Input::file('image');
    $input = array('image' => $file);
    $rules = array(
      'image' => 'image'
    );
    $validator = Validator::make($input, $rules);
    if ( $validator->fails() )
    {
      //return $this->response->error('could_not_add_image', 500);
      //return Response::json(['success' => false, 'errors' => $validator->getMessageBag()->toArray()]);

    }
    else {
      $entry = new Image();

      $destinationPath = 'uploads/';

      $entry->mime = $file->getClientMimeType();
      $entry->original_filename = $file->getClientOriginalName();
      $extension = $file->getClientOriginalExtension();
      $filename = $file->getFilename().'.'.$extension;
      $entry->filename = $filename;
      $entry->project_id = $id;
      $entry->save();



      Input::file('image')->move($destinationPath, $filename);



      //return $this->response->created();
      //return Response::json(['success' => true, 'file' => asset($destinationPath.$filename)]);

    }

    }
    else
    return $this->response->error('could_not_create_question_only_admin', 500);

  }

  	public function get($project_id){

		$images = Image::where('project_id', '=' ,$project_id)->get();
    if(!$images)
        throw new NotFoundHttpException;
    return $images;
	}

private function currentUser() {
    return JWTAuth::parseToken()->authenticate();
}

}
