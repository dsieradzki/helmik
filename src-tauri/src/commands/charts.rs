use crate::commands::error::error_to_string;
use crate::helm;

#[tauri::command]
pub async fn find_charts_in_repo(filter: String) -> Result<Vec<helm::cmd::ChartListItem>, String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .find_charts_in_repo(filter)
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn get_chart_details(name: String) -> Result<helm::cmd::ChartDetails, String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .get_chart_details(name)
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn install_chart(request: helm::cmd::InstallChartRequest) -> Result<(), String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .install_chart(request)
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn uninstall_chart(release_name: String, namespace: String) -> Result<(), String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .uninstall_chart(release_name, namespace)
        .map_err(error_to_string())?;
    Ok(result)
}

#[tauri::command]
pub async fn get_values(release_name: String, namespace: String) -> Result<String, String> {
    let mut executor = Box::new(crate::executor::DefaultExecutor::new());
    let result = helm::Api::new(executor.as_mut())
        .get_values(release_name, namespace)
        .map_err(error_to_string())?;
    Ok(result)
}
