<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\Image;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;

class ImageController extends Controller
{
    // get all image adresses
    public function index()
    {
        $images = Image::orderBy('project_id', 'DESC')
    ->get()
    ->toArray();

        return $images;
    }

    //move image to correct place in server and give random filename for storage in database
    public function add($id)
    {
        if ($this->currentUser()['isAdmin']) {
            $file = Input::file('image');
            $input = array('image' => $file);
            $rules = array('image' => 'image',);
            $validator = Validator::make($input, $rules);
            if ($validator->fails()) {
                return $this->response->error('could_not_add_image', 500);
                //return Response::json(['success' => false, 'errors' => $validator->getMessageBag()->toArray()]);
            } else {
                //move image to correct place in server and give random filename for storage in database
                $entry = new Image();
                $destinationPath = 'uploads/';
                $entry->mime = $file->getClientMimeType();
                $entry->original_filename = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = $file->getFilename().'.'.$extension;
                $entry->filename = $filename;
                $entry->project_id = $id;
                $entry->save();
                //move image to correct place after adding name to database server
                Input::file('image')->move($destinationPath, $filename);

                return $this->response->created();
                //return Response::json(['success' => true, 'file' => asset($destinationPath.$filename)]);
            }
        } else {
            return $this->response->error('could_not_add_image_only_admin', 500);
        }
    }

    //get all images for a project (project_id needed)
    public function get($project_id)
    {
        $images = Image::where('project_id', '=', $project_id)->get();
        if (!$images) {
            throw new NotFoundHttpException();
        }

        return $images;
    }
    //easy function that returns currently logged in user
    private function currentUser()
    {
        return JWTAuth::parseToken()->authenticate();
    }
}
