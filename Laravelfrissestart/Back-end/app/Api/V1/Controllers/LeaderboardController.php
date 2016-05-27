<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\User;
use App\Leaderboard;
use App\Http\Requests;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class LeaderboardController extends Controller
{
    public function updateLeaderboard()
    {
      $leaderboard = Leaderboard::firstOrCreate('user_id' => $this->currentUser()["id"]);
      $leaderboard->score = $this->currentUser()["questiontotal"] * 10;
      $leaderboard->username = $this->currentUser()["firstname"]." ".$this->currentUser()["name"];
      if($this->currentUser()->leaderboards()->save($leaderboard))
      return $this->response->created();
      else
      return $this->response->error('could_not_update_score', 500);
    }
      private function currentUser() {
          return JWTAuth::parseToken()->authenticate();
      }
}
