use crate::types::*;
use rocket::{
    serde::{
        Serialize,
        Serializer,
        uuid::Uuid,
    },
    tokio::sync::mpsc::Sender,
};

#[derive(Clone, Debug)]
pub struct Player {
    username: String,
    color: Color,
    token: Uuid,
    msg_tx: Sender<Message>,
}

impl Player {
    // Constructor
    pub fn new(username: &str, msg_tx: Sender<Message>) -> Self {
        Player {
            username: username.to_string(),
            color: Color::random(),
            token: Uuid::new_v4(),
            msg_tx,
        }
    }

    pub fn get_token(&self) -> &Uuid {
        &self.token
    }

    pub fn check_token(&self, token: &Uuid) -> bool {
        &self.token == token
    }

    pub async fn send_msg(&self, msg: &str) {
        self.msg_tx.send(Message::new(msg)).await.unwrap();
    }
}


#[derive(Debug, Serialize)]
pub struct SanitizedPlayer {
    username: String,
    color: Color,
}

impl From<&Player> for SanitizedPlayer {
    fn from(player: &Player) -> Self {
        SanitizedPlayer {
            username: player.username.clone(),
            color: player.color,
        }
    }
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
