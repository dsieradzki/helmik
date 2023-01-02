use crate::commands::error::error_to_string;
use crate::helm;

#[tauri::command]
pub async fn version() -> Result<String, String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .version()
        .map_err(error_to_string())?;
    Ok(result)
}
