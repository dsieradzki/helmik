use crate::helm;

pub fn error_to_string() -> fn(helm::api::Error) -> String {
    |e| -> String{ e.to_string() }
}
