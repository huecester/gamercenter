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
fn list_rooms(rooms: &State<Rooms>) -> Json<Vec<Room>> {
    let clone = Arc::clone(rooms);
    let rooms = clone.lock().unwrap();

    Json(rooms.values().map(|room| room.to_owned()).collect())
}

#[post("/rooms", data = "<room>")]
fn create_room(room: Form<Room>, rooms: &State<Rooms>) -> Created<String> {
    let clone = Arc::clone(rooms);
    let mut rooms = clone.lock().unwrap();

    let room = room.into_inner();
    let id = Uuid::new_v4();
    let id_string = id.to_simple().to_string();

    rooms.insert(id, room);
    Created::new("https://example.com/").body(id_string)
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

