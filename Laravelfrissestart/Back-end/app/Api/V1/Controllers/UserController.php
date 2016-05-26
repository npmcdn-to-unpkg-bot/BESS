<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\User;

use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends Controller
{
  use Helpers;
  public function changePassword(Request $request)
  {
    $user = User::find($this->currentUser()["id"]);
    if(!$user)
    throw new NotFoundHttpException;
    $user->password = $request->get('newpassword');
    if($user->save())
    {
      return $this->response->noContent();
    }
    else
    {
      return $this->response->error('could_not_update_project', 500);
    }
  }

  private function currentUser() {
    return JWTAuth::parseToken()->authenticate();
  }
}
