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
            loop {
                yield Event::data("ping");
                time::interval(Duration::from_secs(1)).tick().await;
            }
        })
    } else {
        Err((Status::NotFound, format!("No room with ID {}", room_id)))
    }
}
