use crate::commands::error::error_to_string;
use crate::helm;

#[tauri::command]
pub async fn list_releases() -> Result<Vec<helm::cmd::Release>, String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .list()
        .map_err(error_to_string())?;
    Ok(result)
}
