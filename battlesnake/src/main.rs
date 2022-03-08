#[macro_use] extern crate rocket;

use std::sync::{Arc, Mutex};
use rocket::{
    serde::json::Json,
    State,
};
use battlesnake_server::types::*;

type Rooms = Arc<Mutex<Vec<Room>>>;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/rooms")]
fn rooms(rooms: &State<Rooms>) -> Json<Vec<Room>> {
    Json(Arc::clone(rooms).lock().unwrap().to_vec())
}

#[launch]
// TODO:
// - Room constructor
// - Player constructor
fn rocket() -> _ {
    rocket::build()
        .manage(Arc::new(Mutex::new(vec![Room {name: String::from("bazinga"), password: String::from("secure")}, Room {name: String::from("one"), password: String::from("gaming")}])))
        .mount("/", routes![index, rooms])
}

