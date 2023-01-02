#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]


mod helm;
pub mod executor;
pub mod commands;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::releases::list_releases,
            commands::repo::repos,
            commands::repo::delete_repository,
            commands::repo::add_repository,
            commands::repo::update_repository,
            commands::repo::refresh_repositories,
            commands::charts::install_chart,
            commands::charts::find_charts_in_repo,
            commands::charts::get_chart_details,
            commands::charts::uninstall_chart,
            commands::charts::get_values,
            commands::others::version
        ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
