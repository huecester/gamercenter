use crate::types::*;
use rocket::{
    get,
    http::Status,
    response::stream::{Event, EventStream},
    serde::uuid::Uuid,
    State,
    tokio::time::{self, Duration},
};

#[get("/<room_id>")]
pub async fn join_room(room_id: Uuid, rooms: &State<Rooms>) -> Result<EventStream![], (Status, String)> {
    let rooms = rooms.clone().lock().unwrap();

    if let Some(room) = rooms.get(&room_id) {
        Ok(EventStream! {
            yield Event::data("data")
                .event("event")
                .with_comment("comment");
        })
    } else {
        Err((Status::NotFound, format!("No room with ID {}", room_id)))
    }
}
