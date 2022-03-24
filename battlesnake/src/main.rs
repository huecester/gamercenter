#[macro_use] extern crate rocket;

use std::default::Default;
use battlesnake_server::{
    types::*,
    routes::*,
};


#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    let rooms: Rooms = Default::default();

    rocket::build()
        .manage(rooms)
        .mount("/", routes![index])
        .mount("/rooms", routes![list_rooms, create_room, join_room, send_message])
}

