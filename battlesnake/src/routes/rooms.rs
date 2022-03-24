use std::collections::HashMap;
use crate::types::*;
use rocket::{
    get,
    post,
    form::Form,
    State,
    response::status::Created,
    serde::{
        json::Json,
        uuid::Uuid,
    },
};

#[get("/")]
pub fn list_rooms(rooms: &State<Rooms>) -> Json<HashMap<Uuid, SanitizedRoom>> {
    let rooms = rooms.read().unwrap();
    Json(rooms.iter().map(|(id, room)| (id.clone(), room.into())).collect())
}

#[post("/", data = "<room>")]
pub fn create_room(room: Form<FormRoom>, rooms: &State<Rooms>) -> Created<String> {
    let room = Room::from(room.into_inner());
    let id = Uuid::new_v4();

    rooms.write().unwrap().insert(id, room);
    Created::new(format!("/games/battlesnake/{}", id))
}

