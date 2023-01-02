use crate::commands::error::error_to_string;
use crate::helm;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
pub async fn repos() -> Result<Vec<helm::cmd::Repo>, String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .repos()
        .map_err(error_to_string())?;
    Ok(result)
}


#[tauri::command]
pub async fn add_repository(name: String, url: String) -> Result<(), String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .add_repository(name, url)
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn update_repository(old_name: String, name: String, url: String) -> Result<(), String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .update_repository(old_name, name, url)
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn refresh_repositories() -> Result<(), String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .refresh_repositories()
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn delete_repository(name: String) -> Result<(), String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .delete_repository(name)
        .map_err(error_to_string())?;
    Ok(result)
}

