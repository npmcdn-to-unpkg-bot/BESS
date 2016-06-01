<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\User;
use App\Leaderboard;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends Controller
{
    use Helpers;

    public function changePassword(Request $request)
    {   //find logged in user by id
        $user = User::find($this->currentUser()['id']);
        if (!$user) {
            throw new NotFoundHttpException();
        }
        //will automaticly be hashed (check user model for function)
        $user->password = $request->get('newpassword');
        if ($user->save()) {
            return $this->response->noContent();
        } else {
            return $this->response->error('could_not_change_password', 500);
        }
    }

    public function changeResidence(Request $request)
    {
        $user = User::find($this->currentUser()['id']);
        if (!$user) {
            throw new NotFoundHttpException();
        }
        if ($request->get('residence')) {
            $user->residence = $request->get('residence');
        }

        if ($user->save()) {
            return $this->response->noContent();
        } else {
            return $this->response->error('could_not_change_residence', 500);
        }
    }
    public function changeName(Request $request)
    {
        $user = User::find($this->currentUser()['id']);
        if (!$user) {
            throw new NotFoundHttpException();
        }
        if ($request->get('firstname')) {
            $user->firstname = $request->get('firstname');
        }
        if ($request->get('name')) {
            $user->name = $request->get('name');
        }

        if ($user->save()) {
            return $this->response->noContent();
        } else {
            return $this->response->error('could_not_change_name', 500);
        }
    }

    public function changeEmail(Request $request)
    {
        $user = User::find($this->currentUser()['id']);
        if (!$user) {
            throw new NotFoundHttpException();
        }
        if ($request->get('email')) {
            $user->email = $request->get('email');
        }
        if ($user->save()) {
            return $this->response->noContent();
        } else {
            return $this->response->error('could_not_change_email', 500);
        }
    }

    public function changeScore(Request $request)
    {
        $user = User::find($this->currentUser()['id']);
        if (!$user) {
            throw new NotFoundHttpException();
        }
        if ($request->get('questiontotal')) {
            $user->questiontotal = $request->get('questiontotal');
        }
        if ($user->save()) {
            //check if user is already in loaderboard then update else create entry
            $leaderboard = Leaderboard::firstOrCreate(['user_id' => $this->currentUser()['id']]);
            //total questions * 10 is total score
            $leaderboard->score = $this->currentUser()['questiontotal'] * 10;
            //to show in global leaderboards
            $leaderboard->username = $this->currentUser()['firstname'].' '.$this->currentUser()['name'];
            if ($this->currentUser()->leaderboards()->save($leaderboard)) {
                return $this->response->created();
            } else {
                return $this->response->error('could_not_update_score', 500);
            }
        } else {
            return $this->response->error('could_not_update_score', 500);
        }
    }

  //easy function that returns currently logged in user
  private function currentUser()
  {
      return JWTAuth::parseToken()->authenticate();
  }
}
