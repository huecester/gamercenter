use crate::types::*;
use rocket::{
    get,
    post,
    http::{Cookie, CookieJar, Status},
    response::{
        status::Created,
        stream::{Event, EventStream},
    },
    State,
    serde::uuid::Uuid,
};

#[get("/<room_id>", data = "<username>")]
pub async fn join_room(room_id: Uuid, username: &str, rooms: &State<Rooms>, jar: &CookieJar<'_>) -> Result<EventStream![], (Status, String)> {
    // Username validation
    if username.len() <= 0 {
        return Err((Status::BadRequest, "No username provided.".to_string()));
    } else if username.len() >= 32 {
        return Err((Status::UnprocessableEntity, "Username too long.".to_string()));
    }

    // Check for room
    let rooms = rooms.read().unwrap();
    let room = if let Some(room) = rooms.get(&room_id) {
        room
    } else {
        return Err((Status::NotFound, format!("Room ID {} not found.", room_id)));
    };

    let mut msg_rx = room.subscribe();
    let (id, token) = room.add_player(username);

    jar.add(Cookie::new("id", id.to_hyphenated().to_string()));
    jar.add_private(Cookie::new("token", token.to_hyphenated().to_string()));

    Ok(EventStream! {
        while let Ok(msg) = msg_rx.recv().await {
            yield Event::data(msg.msg);
        }
    })
}

#[post("/<room_id>/<player_id>/message", data = "<msg>")]
pub async fn send_message(room_id: Uuid, player_id: Uuid, msg: &str, rooms: &State<Rooms>, jar: &CookieJar<'_>) -> Result<Created<()>, (Status, String)> {
    let player = {
        // Check for room
        let rooms = rooms.read().unwrap();
        let room = if let Some(room) = rooms.get(&room_id) {
            room
        } else {
            return Err((Status::NotFound, format!("Room ID {} not found.", room_id)));
        };

        // Check for player
        let players = room.players.read().unwrap();
        let player = if let Some(player) = players.get(&player_id) {
            player
        } else {
            return Err((Status::NotFound, format!("Player ID {} not found in room ID {}.", player_id, room_id)));
        };

        // Token to UUID
        let token = if let Some(cookie) = jar.get_private("token") {
            if let Ok(token) = Uuid::parse_str(cookie.value()) {
                token
            } else {
                return Err((Status::Unauthorized, "Invalid token.".to_string()));
            }
        } else {
            return Err((Status::Unauthorized, "Token not found.".to_string()));
        };

        // Authentication
        if !player.check_token(&token) {
            return Err((Status::Unauthorized, format!("Token {} does not match player token.", token)));
        }

        player.to_owned()
    };

    player.send_msg(msg).await;
    Ok(Created::new(""))
}

