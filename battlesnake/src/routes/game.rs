use crate::types::{*, Message::*};
use rocket::{
    get,
    http::Status,
    response::stream::{Event, EventStream},
    serde::uuid::Uuid,
    State,
};

#[get("/<room_id>")]
pub async fn join_room(room_id: Uuid, rooms: &State<Rooms>) -> Result<EventStream![], (Status, String)> {
    let rooms = rooms.clone().lock().unwrap();

    if let Some(room) = rooms.get(&room_id) {
        let mut msg_rx = room.subscribe();

        Ok(EventStream! {
            while let Ok(msg) = msg_rx.recv().await {
                match msg {
                    Chat(msg) => yield Event::data(msg),
                }
            }
        })
    } else {
        Err((Status::NotFound, format!("No room with ID {}", room_id)))
    }
}
