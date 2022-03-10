use rocket::{
    form::FromForm,
    serde::Serialize,
};

#[derive(Clone, Debug, FromForm, Serialize)]
pub struct Room {
    #[field(validate = len(1..=32))]
    name: String,

    #[field(validate = len(..=32))]
    password: Option<String>,

    // #[field(default = vec![])]
    // players: Vec<Player>,
}

impl Room {
    // Methods
    pub fn get_name(&self) -> &str {
        &self.name
    }

    pub fn check_password(&self, input: &str) -> bool {
        if let Some(password) = &self.password {
            password == input
        } else {
            true
        }
    }
}


#[derive(Clone, Debug, Serialize)]
pub struct Player {
    username: String,
    // id: String,
    // color: Color,
}
