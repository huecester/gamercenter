use crate::types::*;
use rocket::{
    http::{CookieJar, Status},
    request::{self, Request, FromRequest},
    serde::{
        Serialize,
        Serializer,
        uuid::Uuid,
    },
    State,
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

    pub fn sanitized(&self) -> SanitizedPlayer {
        SanitizedPlayer {
            username: self.username.clone(),
            color: self.color,
        }
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for Player {
    type Error = String;

    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        let jar = req.guard::<&CookieJar>().await.unwrap();
        let rooms = req.guard::<&State<Rooms>>().await.unwrap().clone().lock().unwrap();

        // UUID validation
        if let (Some(Ok(room_id)), Some(Ok(player_id))) = (req.param::<Uuid>(0), req.param::<Uuid>(1)) {
            // Get room
            if let Some(room) = rooms.get(&room_id) {
                // Get player
                if let Some(player) = room.get_player(&player_id) {
                    // Authentication
                    if jar.get_private("token").and_then(|cookie| Some(cookie.value().to_string())) == Some(format!("{}", player.token.to_hyphenated())) {
                        request::Outcome::Success(player.to_owned())
                    } else {
                        request::Outcome::Failure((Status::Unauthorized, "Unauthorized.".to_string()))
                    }
                } else {
                    request::Outcome::Failure((Status::NotFound, format!("Player ID {} not found.", player_id)))
                }
            } else {
                request::Outcome::Failure((Status::NotFound, format!("Room ID {} not found.", room_id)))
            }
        } else {
            request::Outcome::Failure((Status::BadRequest, "Invalid ID(s).".to_string()))
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

