#[macro_use] extern crate rocket;

use rocket::{
    serde::json::Json,
    State,
};
use battlesnake_server::types::*;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/rooms")]
fn rooms(rooms: &State<Vec<Room>>) -> Json<Vec<Room>> {
    Json(rooms.to_vec())
}

#[launch]
// TODO:
// - Room constructor
// - Player constructor
// - Use smart pointer for rooms state
fn rocket() -> _ {
    rocket::build()
        .manage(vec![Room {name: String::from("bazinga"), password: String::from("secure")}, Room {name: String::from("one"), password: String::from("gaming")}])
        .mount("/", routes![index, rooms])
}

