I want you to kick off a new wechat mini program of an agile poker app. This project is called "PokerFaceOff". It contains these functions: Create a room, Vote, Reveal votes, Go to next round.

User consists of 3 rules: 
1. Voter: Who join to vote, 
2. Host: Who host the room, who can create a round and reveal votes
3. Observer: Just observe the vote.
All users can change their profile. (user_name and avatar_url).

Round has 2 status:
1. Open: Voter can vote, votes are hidden
2. Revealed: Voters can't vote, votes are revealed, everyone in the room can see the votes, and host can create a new round.

A user can create a room, or join an existing room. When in the room, voters can vote, host can reveal the votes. After this round is revealed, host can create a new round.

Any games must happen in a room. User can create a room, or join an existing room. User can share the room to other users use share function provided by wechat mini program.

When a room is created, host can create the first round. When a round is revealed, host can create a new round.

When a new user open the app(not from shared room), he can only create a room.
When user in a room, user can open a new room.

All below are all apis you can use, before that we introduce some data classes:
Room: {
  "room_id": "integer",
  "room_name": "string",
  "current_round_name": "string",
  "current_round_id": "string",
  "current_round_status": "int",
}

UserWithVote: {
  "role": "integer",
  "user_id": "integer",
  "user_name": "string",
  "avatar_url": "string",
  "vote": "integer"
}

role contains 3 conditions: 0 -> voter, 1 -> host, 2 -> observer
vote means vote value, -1 means haven't vote, -2 means skipped.

VoteStatus: {
  "room": Room,
  "users": [UserWithVote],
}

APIS: """
1. Create a Room
* Url: POST https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/createroom
* Description: Creates a new room and assigns the creator as the host and create an initial round.
* Request Body: { "room_name": "string", "created_by_openid": "string", "user_name": "string", "avatar_url": "string"}
* Use scene: User choose to create a room. User must provide user_name and room_name. you can pass "" as avatar_url.  You should invoke wx.login to get the user's openid. After that you can use this api to create a room. When you get the response, you should store the room_id and user_id pair. Remember in different room, user_id is different. User is the host of the room.
* Response: {"user_id": "integer", "room_id": "integer"}

2. Join a Room
* Url: POST https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/joinroom
* Description: Adds a user to a room.
* Request Body: { "user_name": "string", "avatar_url": "string", "role": "integer", "room_id": "integer"}
* Use scene: when user open a room, user must choose to join it to play. You can pass "" as avatar_url. You can pass 0,1,2 as role. You can pass room_id as the room_id you got from the create room api. After that you can use this api to join a room. When you get the response, you should store the user_id and room_id pair.
* Response: {"user_id": "integer"}

3. Create a Round
* Url: POST https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/nextround
* Description: Create and move to a new round in a room.
* Request Body: {"room_id": "long", "user_id": "integer"}
* Use scene: Only the host of the room can create a new round. You can pass room_id as the room_id you got from the create room api. After that you can use this api to move to a new round.
* Response: {}

4. Vote
* Url: POST https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/vote
* Description: Submits a vote for the current round.
* Request Body: { "user_id": "string", "vote_value": "integer" }
* Use scene: When a user vote, you can pass user_id as the user_id you got from the join room api. User can choose to skip this round. -2 means skipped, user can choose one poker card to vote. Cards are 0, 1, 3, 5, 8, 13, skip.
* Response: {}

7. Fetch Room Status
* Url: POST https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/votestatus
* Description: Fetches the current status of a room including the current round and its status.
* Request Body: { "room_id": "integer"}
* Use scene: query room status by room_id. You should update the UI accordingly. Every time after you invoke other apis, you should invoke this api to get the latest status.
* Response: VoteStatus

8. Edit profile
* Url: POST https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/editprofile
* Description: change the user profile.
* Request Body: { "user_id": "integer", "role": "int", "user_name": "string", "avatar_url": "string"}, only user_id is required.
* Use scene: update the user profile or role.
* Response: {}

"""

You can ask for me to provide more information if you need.