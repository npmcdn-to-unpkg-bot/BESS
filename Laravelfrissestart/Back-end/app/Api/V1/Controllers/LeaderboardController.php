<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use App\User;
use App\Leaderboard;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;

class LeaderboardController extends Controller
{
    use Helpers;
    //get leaderboards to show on website/app
    public function index()
    {
        $leaderboard = Leaderboard::orderBy('score', 'DESC')
        ->get()
        ->toArray();

        return $leaderboard;
    }
    //update or create leaderboard entry
    public function updateLeaderboard()
    {   //check if user is already in loaderboard then update else create entry
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
    }
      //easy function that returns currently logged in user
      private function currentUser()
      {
          return JWTAuth::parseToken()->authenticate();
      }
}
