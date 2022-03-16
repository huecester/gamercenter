use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use rocket::{
    form::FromForm,
    serde::{
        Serialize,
        uuid::Uuid,
    },
};

pub type Rooms = Arc<Mutex<HashMap<Uuid, Room>>>;

#[derive(Clone, Debug, FromForm)]
pub struct FormRoom<'a> {
    #[field(validate = len(1..=32))]
    name: &'a str,

    #[field(validate = len(1..=32))]
    password: Option<&'a str>,
}

#[derive(Clone, Debug)]
pub struct Room {
    name: String,
    password: Option<String>,
    // players: Vec<Player>,
}

impl Room {
    // Methods
    pub fn check_password(&self, input: &str) -> bool {
        if let Some(password) = &self.password {
            password == input
        } else {
            true
        }
    }
}

impl From<FormRoom<'_>> for Room {
    fn from(form_room: FormRoom) -> Self {
        Room {
            name: form_room.name.to_string(),
            password: form_room.password.and_then(|password| Some(password.to_string())),
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct SanitizedRoom {
    name: String,
    password: bool,
}

impl From<&Room> for SanitizedRoom {
    fn from(room: &Room) -> Self {
        SanitizedRoom {
            name: room.name.to_string(),
            password: room.password.is_some(),
        }
    }
}
