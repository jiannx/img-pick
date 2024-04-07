// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod image;
mod files;
pub use crate::image::get_image_base64;
pub use crate::files::move_to_trash;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_base64(path: &str, size: u32, quality: u8)-> String {
    // format!("Hello, {}! 23232", name)
    get_image_base64(path, size, quality)
}

#[tauri::command]
fn move_trash(path: &str) {
    // format!("Hello, {}! 23232", name)
    move_to_trash(path)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_base64,
            move_trash,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
