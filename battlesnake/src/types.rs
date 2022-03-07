use rocket::serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct Room {
    pub name: String,
    // id: String,
    // players: Vec<Player>,
    pub password: String,
}


#[derive(Clone, Debug, Serialize)]
pub struct Player {
    username: String,
    // id: String,
    // color: Color,
}
