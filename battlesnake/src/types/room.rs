use std::{
    collections::HashMap,
    sync::{Arc, Mutex, RwLock},
};
use crate::types::*;
use rocket::{
    form::FromForm,
    serde::{
        Serialize,
        uuid::Uuid,
    },
    tokio::{
        self,
        sync::{
            broadcast,
            mpsc,
        },
    },
};

pub type Rooms = RwLock<HashMap<Uuid, Room>>;

#[derive(Debug, FromForm)]
pub struct FormRoom<'a> {
    #[field(validate = len(1..=32))]
    name: &'a str,

    #[field(validate = len(..=32))]
    password: Option<&'a str>,
}

#[derive(Debug)]
pub struct Room {
    name: String,
    password: Option<String>,
    pub players: RwLock<HashMap<Uuid, Player>>,

    msg_client_tx: mpsc::Sender<Message>,
    msg_room_tx: Arc<Mutex<broadcast::Sender<Message>>>,
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

    pub fn add_player(&self, username: &str) -> (Uuid, Uuid) {
        let id = Uuid::new_v4();
        let player = Player::new(username, self.msg_client_tx.clone());
        let token = player.get_token().clone();

        self.players.write().unwrap().insert(id.clone(), player);
        (id, token)
    }

    pub fn subscribe(&self) -> broadcast::Receiver<Message> {
        self.msg_room_tx.clone().lock().unwrap().subscribe()
    }
}

impl From<FormRoom<'_>> for Room {
    fn from(form_room: FormRoom) -> Self {
        let (msg_client_tx, mut msg_room_rx) = mpsc::channel(16);
        let (msg_room_tx, _) = broadcast::channel(16);
        let msg_room_tx = Arc::new(Mutex::new(msg_room_tx));

        let room = Room {
            name: form_room.name.to_string(),
            password: form_room.password.and_then(|password| Some(password.to_string())),
            players: RwLock::new(HashMap::new()),
            msg_client_tx,
            msg_room_tx,
        };
        let clone = room.msg_room_tx.clone();

        tokio::spawn(async move {
            while let Some(msg) = msg_room_rx.recv().await {
                clone.lock().unwrap().send(msg).unwrap();
            }
        });

        room
    }
}


#[derive(Clone, Debug)]
pub struct Message {
    pub msg: String,
}

impl Message {
    pub fn new(msg: &str) -> Message {
        Message {
            msg: msg.to_string(),
        }
    }
}


#[derive(Debug, Serialize)]
pub struct SanitizedRoom {
    name: String,
    password: bool,
    players: HashMap<Uuid, SanitizedPlayer>,
}

impl From<&Room> for SanitizedRoom {
    fn from(room: &Room) -> Self {
        SanitizedRoom {
            name: room.name.clone(),
            password: room.password.is_some(),
            players: room.players.read().unwrap().iter().map(|(id, player)| (id.clone(), player.into())).collect(),
        }
    }
}
