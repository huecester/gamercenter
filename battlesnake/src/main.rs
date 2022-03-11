#[macro_use] extern crate rocket;

use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use rocket::serde::uuid::Uuid;
use battlesnake_server::{
    types::*,
    routes::*,
};


#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
// TODO:
// - Player constructor
fn rocket() -> _ {
    rocket::build()
        .manage(Arc::new(Mutex::new(HashMap::<Uuid, Room>::new())))
        .mount("/", routes![index, list_rooms, create_room])
}

