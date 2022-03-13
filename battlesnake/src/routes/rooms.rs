use std::collections::HashMap;
use crate::types::*;
use rocket::{
    form::Form,
    response::status::Created,
    get,
    post,
    serde::{
        json::Json,
        uuid::Uuid,
    },
    State,
};

#[get("/")]
pub fn list_rooms(rooms: &State<Rooms>) -> Json<HashMap<Uuid, SanitizedRoom>> {
    let rooms = rooms.clone().lock().unwrap();

    let sanitized_rooms = rooms.iter().map(|(id, room)| (id.to_owned(), room.sanitized())).collect();
    Json(sanitized_rooms)
}

#[post("/", data = "<room>")]
pub fn create_room(room: Form<FormRoom>, rooms: &State<Rooms>) -> Created<String> {
    let mut rooms = rooms.clone().lock().unwrap();

    let room = Room::from(room.into_inner());
    let id = Uuid::new_v4();

    rooms.insert(id, room);
    Created::new(format!("/games/battlesnake/{}", id))
}

