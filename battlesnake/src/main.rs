#[macro_use] extern crate rocket;

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use rocket::{
    form::Form,
    response::status::Created,
    serde::{
        json::Json,
        uuid::Uuid,
    },
    State,
};
use battlesnake_server::types::*;

type Rooms = Arc<Mutex<HashMap<Uuid, Room>>>;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/rooms")]
fn list_rooms(rooms: &State<Rooms>) -> Json<HashMap<Uuid, SanitizedRoom>> {
    let rooms = rooms.clone().lock().unwrap();

    let sanitized_rooms = rooms.iter().map(|(id, room)| (id.to_owned(), room.sanitized())).collect();
    Json(sanitized_rooms)
}

#[post("/rooms", data = "<room>")]
fn create_room(room: Form<Room>, rooms: &State<Rooms>) -> Created<String> {
    let mut rooms = rooms.clone().lock().unwrap();

    let room = room.into_inner();
    let id = Uuid::new_v4();
    let id_string = id.to_simple().to_string();

    rooms.insert(id, room);
    Created::new(format!("/games/battlesnake/{}", id_string))
}

#[launch]
// TODO:
// - Room constructor
// - Player constructor
fn rocket() -> _ {
    rocket::build()
        .manage(Arc::new(Mutex::new(HashMap::<Uuid, Room>::new())))
        .mount("/", routes![index, list_rooms, create_room])
}

