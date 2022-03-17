use crate::types::*;
use rocket::{
    serde::{Serialize, Serializer},
    tokio::sync::mpsc::Sender,
};

#[derive(Debug)]
pub struct Player {
    username: String,
    color: Color,
    msg_tx: Sender<Message>,
}

impl Player {
    // Constructor
    pub fn new(username: &str, msg_tx: &Sender<Message>) -> Self {
        Player {
            username: username.to_string(),
            color: Color::random(),
            msg_tx: msg_tx.clone(),
        }
    }

    pub fn sanitized(&self) -> SanitizedPlayer {
        SanitizedPlayer {
            username: self.username.clone(),
            color: self.color,
        }
    }
}

#[derive(Clone, Debug, Serialize)]
pub struct SanitizedPlayer {
    username: String,
    color: Color,
}

#[derive(Copy, Clone, Debug)]
pub struct Color(u8, u8, u8);

impl Color {
    fn random() -> Self {
        Color(rand::random(), rand::random(), rand::random())
    }
}

impl Serialize for Color {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: Serializer,
    {
        serializer.serialize_str(&format!("#{:02x}{:02x}{:02x}", self.0, self.1, self.2))
    }
}

