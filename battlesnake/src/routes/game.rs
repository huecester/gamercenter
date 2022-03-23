use crate::types::*;
use rocket::{
    get,
    post,
    http::{Cookie, CookieJar, Status},
    response::{
        status::Created,
        stream::{Event, EventStream},
    },
    serde::uuid::Uuid,
    State,
};

#[get("/<room_id>", data = "<username>")]
pub async fn join_room(room_id: Uuid, username: &str, rooms: &State<Rooms>, jar: &CookieJar<'_>) -> Result<EventStream![], (Status, String)> {
    if username.len() <= 0 {
        return Err((Status::BadRequest, "No username provided.".to_string()));
    } else if username.len() >= 32 {
        return Err((Status::UnprocessableEntity, "Username too long.".to_string()));
    }

    let mut rooms = rooms.clone().lock().unwrap();

    if let Some(room) = rooms.get_mut(&room_id) {
        let mut msg_rx = room.subscribe();
        let (id, token) = room.add_player(username);

        jar.add(Cookie::new("id", id.to_hyphenated().to_string()));
        jar.add_private(Cookie::new("token", token.to_hyphenated().to_string()));

        Ok(EventStream! {
            while let Ok(msg) = msg_rx.recv().await {
                yield Event::data(msg.msg);
            }
        })
    } else {
        Err((Status::NotFound, format!("No room with ID {}.", room_id)))
    }
}

#[post("/<_room_id>/<_player_id>/message", data = "<msg>")]
pub fn send_message(_room_id: Uuid, _player_id: Uuid, msg: &str, player: Player) -> Created<()> {
    todo!()
}
