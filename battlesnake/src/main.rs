use std::env;
use poem::{
    EndpointExt,
    Route,
    Server,
    get,
    handler,
    listener::TcpListener,
    middleware::Tracing,
    web::Path,
};

#[handler]
fn index() -> &'static str {
    "Hello, world!"
}

#[handler]
fn hello(Path(thing): Path<String>) -> String {
    format!("Hello, {}!", thing)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let port = env::var("PORT").unwrap_or("8000".to_string()).parse::<u16>().unwrap_or(8000);

    tracing_subscriber::fmt::init();

    let app = Route::new()
        .at("/", get(index))
        .at("/:thing", get(hello))
        .with(Tracing);

    Server::new(TcpListener::bind(("127.0.0.1", port)))
        .run(app)
        .await
}
